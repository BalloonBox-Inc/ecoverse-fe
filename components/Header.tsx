import masterLogoWhite from '@assets/images/master-logo.svg';
import Search from '@components/layouts/Search';
import UserMenu from '@components/UserMenu';
import WalletConnectButton from '@components/WalletConnectButton';
import { ClassNameProps } from '@utils/interface/global-interface';
import { navList } from '@utils/side-navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { twMerge } from 'tailwind-merge';

Header.defaultProps = {
  className: '',
};

export default function Header({ className }: ClassNameProps) {
  const router = useRouter();

  const searchTitle =
    navList.find((item) => item.href === router.pathname)?.label ?? '';

  const placeholder = `Search ${searchTitle}`;

  const displaySearch = router.pathname.match(/(projects$)|(forests$)/g);

  return (
    <div className={twMerge(styles.root, className)}>
      <div className={styles.logoDiv}>
        <Link href="/" className={styles.logoLink}>
          <Image src={masterLogoWhite} alt="master-logo" width={150} />
        </Link>
      </div>
      <div className={styles.menuDiv}>
        {displaySearch && <Search placeholder={placeholder} />}
        <WalletConnectButton />
        <UserMenu />
      </div>
    </div>
  );
}

const styles = {
  root: 'navbar gap-2 fixed top-0 h-nav z-10 px-4 font-figtree bg-primary/40',
  menu: 'flex-none',
  menuButton: 'btn btn-square btn-ghost',
  menuIcon: 'fill-current scale-50',
  logoDiv: 'flex-1',
  logoLink: 'normal-case text-xl hover:bg-transparent',
  menuDiv: 'flex-none gap-2',
};

/*
todo:
1. showSearch?
*/
