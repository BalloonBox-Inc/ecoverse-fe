import {
  selectIsPurchasing,
  stopPurchasing,
} from '@plugins/store/slices/purchase';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function Purchase() {
  const dispatch = useDispatch();
  const isPurchasing = useSelector(selectIsPurchasing);

  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    setOpenModal(isPurchasing);
  }, [isPurchasing]);

  const handlePurchaseClose = () => {
    dispatch(stopPurchasing());
  };

  //   const handleInputOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     console.log(e.target.value);
  //   };

  return (
    <>
      <input
        type="checkbox"
        className={styles.inputModal}
        checked={openModal}
        readOnly
      />
      <div className={styles.root}>
        <div className={styles.modal}>
          <h2 className={styles.header}>Checkout Tiles</h2>
          <div className={styles.buttonsContainer}>
            <button
              className={styles.closeButton}
              onClick={handlePurchaseClose}
            >
              Back to tile selection
            </button>
            <button className={styles.purchaseButton}>Purchase</button>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  root: 'modal',
  modal: 'modal-box bg-base-100/50 backdrop-blur',
  inputModal: 'modal-toggle',
  header: 'uppercase bold text-lg',
  buttonsContainer:
    'w-full grid grid-cols-2 items-center justify-items-stretch gap-2 mt-8',
  closeButton: 'btn btn-link no-underline text-neutral border-0',
  purchaseButton: 'btn btn-primary',
};
