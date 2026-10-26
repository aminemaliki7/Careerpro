import type { Metadata } from 'next';
import { SignIn } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Sign In',
  robots: {
    index: false,
    follow: true,
  },
};

export default function SignInPage() {
  return (
    <main className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center bg-slate-50 px-4 py-12">
      <SignIn />
    </main>
  );
}