// app/hooks/useUserRole.ts
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

type UserRole = 'candidate' | 'founder' | 'company' | null;

interface UseUserRoleReturn {
  role: UserRole;
  isLoading: boolean;
  error: string | null;
  isCandidate: boolean;
  isFounder: boolean;
  isCompany: boolean;
  setRole: (newRole: UserRole) => Promise<void>;
}

export function useUserRole(): UseUserRoleReturn {
  const { isSignedIn, user } = useUser();
  const [role, setRoleState] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user role on mount and when user changes
  useEffect(() => {
    if (!isSignedIn || !user) {
      setIsLoading(false);
      return;
    }

    async function fetchUserRole() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/auth/set-role', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user role');
        }

        const data = await response.json();
        setRoleState(data.role || null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        setRoleState(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserRole();
  }, [isSignedIn, user?.id]);

  // Function to set user role
  const setRole = async (newRole: UserRole) => {
    if (!newRole) {
      setError('Role cannot be null');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/set-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to set role');
      }

      const data = await response.json();
      setRoleState(data.profile.role);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    role,
    isLoading,
    error,
    isCandidate: role === 'candidate',
    isFounder: role === 'founder',
    isCompany: role === 'company' || role === 'founder',
    setRole
  };
}