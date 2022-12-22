import MapControl from '@components/MapControl';
import MapProvider from '@context/map';
import { clearSearch } from '@plugins/store/slices/search-query';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearSearch());
  }, [dispatch]);

  return (
    <div className={styles.root}>
      <MapProvider>
        <main className={styles.main}>
          <MapControl />
        </main>
      </MapProvider>
    </div>
  );
}

const styles = {
  root: 'relative w-screen h-screen',
  main: 'absolute inset-0',
};
