import MapControl from '@components/MapControl';
import MapExtraMethodsProvider from '@context/map';
import { clearSearch } from '@plugins/store/slices/search-query';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';
import { MapProvider } from 'react-map-gl';
import { useDispatch } from 'react-redux';

export default function Home() {
  const dispatch = useDispatch();
  const walletInfo = useWallet();

  console.log(walletInfo);

  useEffect(() => {
    dispatch(clearSearch());
  }, [dispatch]);

  return (
    <div className={styles.root}>
      <MapProvider>
        <MapExtraMethodsProvider>
          <main className={styles.main}>
            <MapControl />
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
