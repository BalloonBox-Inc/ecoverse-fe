import MapLayout from '@components/layouts/MapLayout';

export default function Home() {
  return (
    <div className={styles.root}>
      <MapLayout>
        <main>
          {/* control here. maybe sidebar */}
          <>Map</>
        </main>
      </MapLayout>
    </div>
  );
}

const styles = {
  root: 'relative w-screen h-screen',
};
