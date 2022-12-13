import ecoverse from '@assets/images/ecoverse.gif';
import Image from 'next/image';
import React from 'react';

export default function PageLoader() {
  return (
    <div className={styles.root}>
      <div className={styles.figure}>
        <Image src={ecoverse} alt="ecoverse loading" priority />
      </div>
      <progress className={styles.progress}></progress>
      <h1>Loading Map</h1>
    </div>
  );
}

const styles = {
  root: 'absolute h-screen w-screen bg-white z-6 opacity-1 flex flex-col justify-center items-center bg-loader text-primary animate-loader',
  figure: 'w-96 h-96',
  progress: 'progress  progress-primary w-56 mb-4',
};
