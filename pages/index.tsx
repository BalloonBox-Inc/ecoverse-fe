import MapLayout from '@components/layouts/MapLayout';
import MapControl from '@components/MapControl';
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
      <MapLayout>
        <main className={styles.main}>
          <MapControl />
        </main>
      </MapLayout>
    </div>
  );
}

const styles = {
  root: 'relative w-screen h-screen',
  main: 'absolute inset-0',
};
