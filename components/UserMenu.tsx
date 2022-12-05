import AccountIcon from '@components/Icons/AccountIcon';
import { useAuth } from '@context/auth';
import { logout } from '@services/api/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export default function UserMenu() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const { mutate: logoutMutate } = useMutation(logout, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cookie'] });
    },
  });

  const dropdownDisplay = useCallback(() => {
    return isAuthenticated ? (
      <>
        <li className={styles.menuItem}>
          <Link href="/profile" className={styles.profile}>
            Profile
          </Link>
        </li>
        <li className={styles.menuItem}>
          <button onClick={logoutHandler}>Logout</button>
        </li>
      </>
    ) : (
      <>
        <li className={styles.menuItem}>
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
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  return (
    <div
      className={twMerge(
        styles.root,
        isMenuOpen ? styles.dropdownOpen : styles.dropdownClose
      )}
    >
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
    'mt-3 p-2 shadow menu menu-compact dropdown-content bg-primary rounded-box w-52 visible',
  menuItem: 'text-base-100',
  dropdownClose: 'dropdown-close',
  dropdownOpen: 'dropdown-open',
};
