import { useAuth } from '@context/auth';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function withAuth(Component: React.FC) {
  return function RequireAuth() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/login');
      }
    }, [isAuthenticated, router]);
    return <Component />;
  };
}
