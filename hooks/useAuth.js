import { useUser } from '@clerk/nextjs';

/**
 * useAuth — wraps Clerk's useUser for app-level auth state.
 * Returns normalized user profile matched to MongoDB document structure.
 */
export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();

  return {
    isLoaded,
    isSignedIn,
    clerkId: user?.id ?? null,
    name: user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : null,
    email: user?.primaryEmailAddress?.emailAddress ?? null,
    avatar: user?.imageUrl ?? null,
    firstName: user?.firstName ?? null,
  };
}
