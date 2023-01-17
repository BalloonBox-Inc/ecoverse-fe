import ChevronLeftIcon from '@components/Icons/ChevronLeftIcon';
import { selectTilesToPurchaseDetails } from '@plugins/store/slices/purchase';
import withAuth from 'hoc/withAuth';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

function Checkout() {
  const router = useRouter();

  const tilesToPurchase = useSelector(selectTilesToPurchaseDetails);

  const backButtonHandler = useCallback(() => {
    router.push({
      pathname: '/',
      query: {
        lng: tilesToPurchase.center?.lng,
        lat: tilesToPurchase.center?.lat,
      },
    });
  }, [router, tilesToPurchase]);

  useEffect(() => {
    if (tilesToPurchase.tiles.length === 0) {
      router.back();
    }
  }, [router, tilesToPurchase]);

  return (
    <div className={styles.root}>
      <button className={styles.backButton} onClick={backButtonHandler}>
        <ChevronLeftIcon className={styles.chevronIcon} /> Back to Map
      </button>
    </div>
  );
}

export default withAuth(Checkout);

const styles = {
  root: 'container my-4 mx-auto h-custom-y-screen-2',
  backButton:
    'btn btn-link no-underline w-fit gap-1 hover:no-underline hover:border-primary',
  chevronIcon: 'h-3 w-3 fill-current',
};
