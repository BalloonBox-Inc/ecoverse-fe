import Header from '@components/Header';
import SideNav from '@components/SideNav';
import { ChildrenProps as Props } from '@utils/global-interface';

export default function Layout({ children }: Props) {
  return (
    <div className={styles.root}>
      <Header />
      <div className={styles.content}>
        <div className={styles.sideNav}>
          <SideNav className={styles.customNav} />
        </div>
        <main className={styles.main}>
          <div className={styles.mainContent}>{children}</div>
        </main>
      </div>
    </div>
  );
}

const styles = {
  root: 'relative ',
  sideNav: 'fixed',
  customNav: 'h-custom-y-screen pt-4',
  content: 'h-custom-y-screen w-screen overflow-auto mt-nav',
  main: 'ml-nav',
  mainContent: 'container',
};
