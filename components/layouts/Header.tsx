import MenuIcon from '@components/Icons/MenuIcon';
import UserMenu from '@components/layouts/UserMenu';
import Link from 'next/link';

export default function Header() {
  return (
    <div className={styles.navbar}>
      <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <MenuIcon className="fill-current scale-50" />
        </button>
      </div>
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
  menu: 'flex-none',
  menuButton: 'btn btn-square btn-ghost',
  menuIcon: 'fill-current scale-50',
  logoDiv: 'flex-1',
  logoLink: 'btn btn-ghost normal-case text-xl hover:bg-transparent',
  menuDiv: 'flex-none gap-2',
};

/*
todo:
1. need to add logo for ecoverse
*/
