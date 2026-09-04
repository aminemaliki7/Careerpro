// src/app/admin/layout.tsx
// Server-side authorization gate for every route under /admin.
// Unauthenticated and non-admin users are redirected away before any page
// (server or client) renders, removing the previous client-side "admin
// password" bypass. Because this is a server component, it can safely call the
// server-side authorization helper.
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/authorization';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authResult = await requireAdmin();
  if (authResult.response) {
    redirect('/');
  }
  return <>{children}</>;
}
