import ChevronLeftIcon from '@components/Icons/ChevronLeftIcon';
import { selectTilesToPurchaseDetails } from '@plugins/store/slices/purchase';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

export default function Checkout() {
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

  return (
    <div className={styles.root}>
      <button className={styles.backButton} onClick={backButtonHandler}>
        <ChevronLeftIcon className={styles.chevronIcon} /> Back to Map
      </button>
    </div>
  );
}

const styles = {
  root: 'container my-4 mx-auto h-custom-y-screen-2',
  backButton:
    'btn btn-link no-underline w-fit gap-1 hover:no-underline hover:border-primary',
  chevronIcon: 'h-3 w-3 fill-current',
};
