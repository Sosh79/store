'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (status === 'loading') {
      return; // Still checking session
    }

    if (status === 'unauthenticated' || !session) {
      // Not logged in - redirect to login
      router.replace('/admin/login');
      return;
    }

    // Session exists - user is authorized
    setIsAuthorized(true);
  }, [status, session, router]);

  // Show loading while checking authentication
  if (status === 'loading' || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // User is authenticated - show protected content
  return <>{children}</>;
}
