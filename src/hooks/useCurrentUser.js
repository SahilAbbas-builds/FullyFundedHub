import { useAuth } from '@/lib/AuthContext';

/**
 * Compatibility wrapper: preserves the original { user, loading, refresh }
 * interface while delegating to the Supabase-backed AuthContext.
 */
export function useCurrentUser() {
  const { user, isLoadingAuth, checkUserAuth } = useAuth();

  return {
    user: user || null,
    loading: isLoadingAuth,
    refresh: checkUserAuth
  };
}

export function clearCachedUser() {
  // No-op for compatibility â€” AuthContext handles state via onAuthStateChange.
}
