import Barrier from '@components/Icons/Barrier';
import Link from 'next/link';
import React from 'react';

export default function Custom404() {
  return (
    <div className={styles.root}>
      <main className={styles.main}>
        <div className={styles.iconContainer}>
          <Barrier className={styles.icon} />
        </div>
        <div className={styles.content}>
          <h1 className={styles.header}>Are you lost in the forest?</h1>
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
  root: 'h-screen w-screen bg-404 bg-cover bg-bottom relative',
  main: 'w-11/12 max-w-lg absolute top-24 left-2/4 -translate-x-2/4 flex flex-col items-center gap-10 bg-neutral/70 px-4 py-10 rounded-lg shadow-xl backdrop-blur-lg',
  iconContainer: 'w-20 h-20',
  icon: 'fill-error',
  content: 'flex flex-col items-center gap-4 text-center',
  header: 'text-3xl',
  link: 'link link-accent link-hover',
};
