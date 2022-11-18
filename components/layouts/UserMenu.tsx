import AccountIcon from '@components/Icons/AccountIcon';
import { useAuth } from '@context/auth';
import { login, logout } from '@services/api/auth';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';

export default function UserMenu() {
  const { isAuthenticated, setUserAuth } = useAuth();
  const {
    mutate: loginMutate,
    // isLoading: loginIsLoading,
    // isError: loginIsError,
  } = useMutation(login, {
    onSuccess: (data) => setUserAuth(data.data),
  });

  const { mutate: logoutMutate } = useMutation(logout, {
    onSuccess: () => setUserAuth(null),
  });

  const dropdownDisplay = useCallback(() => {
    return isAuthenticated ? (
      <>
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li>
          <a onClick={logoutHandler}>Logout</a>
        </li>
      </>
    ) : (
      <>
        <li>
          <a onClick={loginHandler}>Login</a>
        </li>
      </>
    );
  }, [isAuthenticated]);

  const loginHandler = async () => {
    loginMutate({ username: 'jerick', password: 'password' });
  };

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
        className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
      >
        {dropdownDisplay()}
      </ul>
    </div>
  );
}
