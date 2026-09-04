// src/lib/auth/authorization.ts
// Centralized server-side authorization helpers.
//
// Roles are resolved from the trusted Supabase `user_profiles` table via the
// service-role client (bypasses RLS) because the authenticated Clerk user is
// the source of truth and roles are never read from the client.
//
// Admin access is determined from the authenticated Clerk identity against a
// server-side allowlist of admin Clerk user IDs (`ADMIN_USER_IDS`), or the
// `user_profiles.role === 'admin'` value when present. Client-provided roles
// are never trusted.
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export type AppRole =
  | 'candidate'
  | 'company'
  | 'founder'
  | 'recruiter'
  | 'admin'
  | null;

const COMPANY_ROLES = ['company', 'recruiter', 'founder'] as const;

function parseAdminIds(): Set<string> {
  const raw = process.env.ADMIN_USER_IDS?.replace(/\s+/g, '') ?? '';
  return new Set(raw.split(',').filter(Boolean));
}

/**
 * Resolve the authenticated user's role from the trusted user_profiles table.
 * Returns null when unauthenticated or when no profile/role is found.
 * Uses a module-level cache to avoid a DB round-trip per route.
 */
const roleCache = new Map<string, AppRole>();
const roleRequests = new Map<string, Promise<AppRole | null>>();

export async function getUserRole(userId?: string | null): Promise<AppRole> {
  if (!userId) return null;

  if (roleCache.has(userId)) return roleCache.get(userId)!;
  if (roleRequests.has(userId)) return (await roleRequests.get(userId)) ?? null;

  const request = (async () => {
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('clerk_id', userId)
      .maybeSingle();

    if (error || !data) return null;

    const role = data.role as AppRole;
    if (role === 'candidate' || role === 'company' || role === 'founder' || role === 'recruiter' || role === 'admin') {
      roleCache.set(userId, role);
      return role;
    }
    return null;
  })();

  roleRequests.set(userId, request);
  try {
    return (await request) ?? null;
  } finally {
    roleRequests.delete(userId);
  }
}

/**
 * Resolve the current Clerk session and return the userId, or null.
 */
export async function getUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId ?? null;
}

/**
 * Require an authenticated user. Returns a 401 response when missing.
 */
export async function requireUser(): Promise<
  { userId: string; response: null } | { userId: null; response: NextResponse }
> {
  const userId = await getUserId();
  if (!userId) {
    return {
      userId: null,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
  return { userId, response: null };
}

/**
 * Require an authenticated user AND a company-side role (company/recruiter/founder).
 */
export async function requireCompanyUser(): Promise<
  { userId: string; role: Exclude<AppRole, null>; response: null } | { userId: null; role: null; response: NextResponse }
> {
  const { userId, response } = await requireUser();
  if (response) return { userId: null, role: null, response };

  const role = await getUserRole(userId!);
  if (!role || !COMPANY_ROLES.includes(role as (typeof COMPANY_ROLES)[number])) {
    return {
      userId: null,
      role: null,
      response: NextResponse.json({ error: 'Company access required' }, { status: 403 }),
    };
  }
  return { userId: userId!, role, response: null };
}

/**
 * Require an authenticated user AND admin privileges.
 * Admin is determined server-side from the ADMIN_USER_IDS allowlist (Clerk
 * user IDs) or a user_profiles.role of 'admin'. Never trusts the client.
 */
export async function requireAdmin(): Promise<
  { userId: string; response: null } | { userId: null; response: NextResponse }
> {
  const { userId, response } = await requireUser();
  if (response) return { userId: null, response };

  const adminIds = parseAdminIds();
  if (adminIds.has(userId!)) {
    return { userId: userId!, response: null };
  }

  const role = await getUserRole(userId!);
  if (role === 'admin') {
    return { userId: userId!, response: null };
  }

  return {
    userId: null,
    response: NextResponse.json({ error: 'Admin access required' }, { status: 403 }),
  };
}
