import UserMenu from '@components/layouts/UserMenu';
import { ClassNameProps } from '@utils/global-interface';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

Header.defaultProps = {
  className: '',
};

export default function Header({ className }: ClassNameProps) {
  return (
    <div className={twMerge(styles.root, className)}>
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
  root: 'navbar bg-accent gap-2 sticky top-0 h-16 z-10 px-4',
  menu: 'flex-none',
  menuButton: 'btn btn-square btn-ghost',
  menuIcon: 'fill-current scale-50',
  logoDiv: 'flex-1',
  logoLink: 'normal-case text-xl hover:bg-transparent',
  menuDiv: 'flex-none gap-2',
};

/*
todo:
1. need to add logo for ecoverse
*/
