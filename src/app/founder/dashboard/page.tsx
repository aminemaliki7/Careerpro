import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireCompanyUser } from '@/lib/auth/authorization';
import FounderDashboard from './FounderDashboard';

export const metadata: Metadata = {
  title: 'Founder Dashboard | Hirely',
  robots: { index: false, follow: false },
};

export default async function FounderDashboardPage() {
  const authResult = await requireCompanyUser();
  if (authResult.response) {
    redirect(authResult.response.status === 401 ? '/onboarding' : '/dashboard');
  }

  return <FounderDashboard />;
}
