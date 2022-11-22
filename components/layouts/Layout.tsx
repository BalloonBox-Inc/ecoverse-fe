import Header from '@components/Header';
import SideNav from '@components/SideNav';
import { ChildrenProps as Props } from '@utils/global-interface';

export default function Layout({ children }: Props) {
  return (
    <div className={styles.root}>
      <Header />
      <div className={styles.sideNav}>
        <SideNav className={styles.customNav} />
      </div>
      <main className={styles.main}>{children}</main>
    </div>
  );
}

const styles = {
  root: 'relative',
  sideNav: 'absolute',
  customNav: 'h-custom-y-screen pt-4',
  main: 'ml-nav',
};
