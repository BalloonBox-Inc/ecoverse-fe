import MapControl from '@components/MapControl';
import Purchase from '@components/Purchase';
import MapExtraMethodsProvider from '@context/map';
import { clearSearch } from '@plugins/store/slices/search-query';
import { useEffect } from 'react';
import { MapProvider } from 'react-map-gl';
import { useDispatch } from 'react-redux';

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearSearch());
  }, [dispatch]);

  return (
    <div className={styles.root}>
      <MapProvider>
        <MapExtraMethodsProvider>
          <main className={styles.main}>
            <MapControl />
            <Purchase />
          </main>
        </MapExtraMethodsProvider>
      </MapProvider>
    </div>
  );
}

const styles = {
  root: 'relative w-screen h-screen font-figtree',
  main: 'absolute inset-0',
};
