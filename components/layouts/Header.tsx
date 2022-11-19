import UserMenu from '@components/layouts/UserMenu';
import Link from 'next/link';

export default function Header() {
  return (
    <div className={styles.navbar}>
      <div className={styles.logoDiv}>
        <Link href="/" className={styles.logoLink}>
          Ecoverse
        </Link>
      </div>
      <div className={styles.menuDiv}>
        <UserMenu />
      </div>
    </div>
  );
}

const styles = {
  navbar: 'navbar bg-base-100',
  logoDiv: 'flex-1',
  logoLink: 'btn btn-ghost normal-case text-xl',
  menuDiv: 'flex-none gap-2',
};
