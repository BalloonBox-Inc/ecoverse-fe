import MapLayout from '@components/layouts/MapLayout';
import MapControl from '@components/MapControl';

export default function Home() {
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
