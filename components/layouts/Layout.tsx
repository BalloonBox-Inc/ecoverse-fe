import Header from '@components/Header';
import Head from '@components/layouts/Head';
import SideNav from '@components/SideNav';
import { getBasePathName, properCase } from '@utils/helper';
import { ChildrenProps as Props } from '@utils/interface/global-interface';
import { useRouter } from 'next/router';

export default function Layout({ children }: Props) {
  const router = useRouter();

  const title = properCase(getBasePathName(router.pathname));

  return (
    <div className={styles.root}>
      <Head title={title} />
      <Header />
      <div className={styles.content}>
        <div className={styles.sideNav}>
          <SideNav className={styles.customNav} />
        </div>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}

const styles = {
  root: 'relative',
  sideNav: 'fixed h-custom-y-screen z-20',
  customNav: 'pt-4',
  content: 'h-custom-y-screen w-screen overflow-auto mt-nav',
  main: 'ml-nav',
};
