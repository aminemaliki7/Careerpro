// app/hooks/useUserRole.ts
import { useCallback, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export type UserRole = 'candidate' | 'company' | 'founder' | 'recruiter' | null;

const roleCache = new Map<string, Exclude<UserRole, null>>();
const roleRequests = new Map<string, Promise<UserRole>>();

function toUserRole(value: unknown): UserRole {
  return value === 'candidate' || value === 'company' || value === 'founder' || value === 'recruiter'
    ? value
    : null;
}

async function getUserRole(userId: string): Promise<UserRole> {
  const cachedRole = roleCache.get(userId);
  if (cachedRole) return cachedRole;

  const activeRequest = roleRequests.get(userId);
  if (activeRequest) return activeRequest;

  const request = fetch('/api/auth/set-role', { method: 'GET' })
    .then(async (response) => {
      if (!response.ok) throw new Error('Failed to fetch user role');
      const data = await response.json();
      const fetchedRole = toUserRole(data.role);
      if (fetchedRole) roleCache.set(userId, fetchedRole);
      return fetchedRole;
    })
    .finally(() => roleRequests.delete(userId));

  roleRequests.set(userId, request);
  return request;
}

interface UseUserRoleReturn {
  role: UserRole;
  isLoading: boolean;
  error: string | null;
  isCandidate: boolean;
  isFounder: boolean;
  isRecruiter: boolean;
  isCompany: boolean;
  setRole: (newRole: UserRole) => Promise<void>;
}

export function useUserRole(): UseUserRoleReturn {
  const { isSignedIn, user } = useUser();

  const [role, setRoleState] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn || !user) {
      setRoleState(null);
      setIsLoading(false);
      return;
    }

    const userId = user.id;
    const metadataRole = toUserRole(user.publicMetadata?.role);
    if (metadataRole) {
      roleCache.set(userId, metadataRole);
      setRoleState(metadataRole);
      setIsLoading(false);
      return;
    }

    async function fetchUserRole() {
      try {
        setIsLoading(true);
        setError(null);
        setRoleState(await getUserRole(userId));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';

        setError(errorMessage);
        setRoleState(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserRole();
  }, [isSignedIn, user?.id, user?.publicMetadata?.role]);

  const setRole = useCallback(async (newRole: UserRole) => {
    if (!newRole) {
      setError('Role cannot be null');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/set-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: newRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to set role');
      }

      const savedRole = toUserRole(data.profile.role);
      if (savedRole) roleCache.set(user!.id, savedRole);
      setRoleState(savedRole);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error';

      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  return {
    role,
    isLoading,
    error,
    isCandidate: role === 'candidate',
    isFounder: role === 'founder',
    isRecruiter: role === 'recruiter',

    // Company-side dashboard access
    isCompany:
      role === 'company' || role === 'recruiter' || role === 'founder',

    setRole,
  };
}
