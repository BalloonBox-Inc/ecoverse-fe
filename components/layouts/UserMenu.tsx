import AccountIcon from '@components/Icons/AccountIcon';
import { useAuth } from '@context/auth';
import { logout } from '@services/api/auth';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

export default function UserMenu() {
  const { isAuthenticated, setUserAuth } = useAuth();
  const router = useRouter();

  const { mutate: logoutMutate } = useMutation(logout, {
    onSuccess: () => {
      setUserAuth(null);
      router.push('/');
    },
  });

  const dropdownDisplay = useCallback(() => {
    return isAuthenticated ? (
      <>
        <li>
          <Link href="/profile" className="justify-between">
            Profile
            <span className="badge">New</span>
          </Link>
        </li>
        <li>
          <a onClick={logoutHandler}>Logout</a>
        </li>
      </>
    ) : (
      <>
        <li>
          <Link href="/login">Login</Link>
        </li>
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const logoutHandler = async () => {
    logoutMutate();
  };

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <AccountIcon />
        </div>
      </label>
      <ul
        tabIndex={0}
        className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-secondary rounded-box w-52"
      >
        {dropdownDisplay()}
      </ul>
    </div>
  );
}
