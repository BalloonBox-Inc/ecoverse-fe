import AccountIcon from '@components/Icons/AccountIcon';
import { useAuth } from '@context/auth';
import { logout } from '@services/api/auth';
import { queryEventBus } from '@services/event-bus/query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useCallback } from 'react';

export default function UserMenu() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: logoutMutate } = useMutation(logout, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cookie'] });
    },
  });

  const dropdownDisplay = useCallback(() => {
    return isAuthenticated ? (
      <>
        <li>
          <Link href="/profile" className={styles.profile}>
            Profile
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

  const handleClickLabel = () => {
    queryEventBus.emit('clearQuery');
  };

  return (
    <div className={styles.root}>
      <label tabIndex={0} className={styles.label} onClick={handleClickLabel}>
        <div className={styles.avatarContainer}>
          <AccountIcon className={styles.avatar} />
        </div>
      </label>
      <ul tabIndex={0} className={styles.menuList}>
        {dropdownDisplay()}
      </ul>
    </div>
  );
}

const styles = {
  root: 'dropdown dropdown-end',
  profile: 'justify-between',
  label: 'btn btn-ghost btn-circle avatar',
  avatarContainer: 'w-8 h-8 border-current border-2 rounded-full',
  avatar: 'fill-current',
  menuList:
    'mt-3 p-2 shadow menu menu-compact dropdown-content bg-primary/80 rounded-box w-52',
};
