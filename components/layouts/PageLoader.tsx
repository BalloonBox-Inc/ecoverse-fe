import ecoverse from '@assets/images/ecoverse.gif';
import { useMapExtraMethods } from '@context/map';
import { Center } from '@services/map';
import { getCenterFromLngLat } from '@utils/map-utils';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef } from 'react';

export default function PageLoader() {
  const router = useRouter();
  const mapMethods = useMapExtraMethods();

  const loaderRef = useRef(null);

  const animationEndHandler = useCallback(
    (center: Center) => {
      return () => {
        mapMethods?.flyTo(center);
      };
    },
    [mapMethods]
  );

  useEffect(() => {
    if (!loaderRef) return;

    const loader = loaderRef.current as unknown as HTMLElement;
    const center = router.query;

    if (center.lng === undefined || center.lat === undefined) return;

    const mapboxCenter = getCenterFromLngLat(
      Number(center.lng),
      Number(center.lat)
    );

    loader.addEventListener('animationend', animationEndHandler(mapboxCenter));

    return () => {
      loader.removeEventListener(
        'animationend',
        animationEndHandler(mapboxCenter)
      );
    };
  }, [animationEndHandler, loaderRef, router.query]);

  return (
    <div ref={loaderRef} className={styles.root}>
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
