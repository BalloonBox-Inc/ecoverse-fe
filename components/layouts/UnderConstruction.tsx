import ConstructionIcon from '@components/Icons/ConstructionIcon';
import Head from '@components/layouts//Head';
import Link from 'next/link';

export default function UnderConstruction() {
  return (
    <div className={styles.root}>
      <Head
        title="Under Construction"
        description="This page is under construction"
      />
      <main className={styles.main}>
        <div className={styles.iconContainer}>
          <ConstructionIcon className={styles.icon} />
        </div>
        <div className={styles.content}>
          <h1 className={styles.header}>This area is not open yet</h1>
          <p>
            Click here to see the path{' '}
            <Link className={styles.link} href="/">
              home
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}

const styles = {
  root: 'h-screen w-screen bg-404 bg-cover bg-bottom relative text-base-100',
  main: 'w-11/12 max-w-lg absolute top-24 left-2/4 -translate-x-2/4 flex flex-col items-center gap-10 bg-neutral/70 px-4 py-10 rounded-lg shadow-xl backdrop-blur-lg',
  iconContainer: 'w-20 h-20',
  icon: 'fill-warning',
  content: 'flex flex-col items-center gap-4 text-center',
  header: 'text-3xl',
  link: 'link link-accent link-hover',
};
