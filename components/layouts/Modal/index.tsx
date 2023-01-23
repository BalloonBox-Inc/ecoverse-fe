import { ModalType, selectModal } from '@plugins/store/slices/modal';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { twMerge } from 'tailwind-merge';

import LoginModal from './LoginModal';

type Props = {
  rootClass: string;
};

Modal.defaultProps = {
  rootClass: '',
};

export const MODAL = {
  [ModalType.login]: <LoginModal />,
};

Object.freeze(MODAL);

export default function Modal({ rootClass }: Props) {
  const modalType = useSelector(selectModal);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    setShowModal(!!modalType);
  }, [modalType]);

  return (
    <>
      <input
        type="checkbox"
        className={styles.modalToggler}
        checked={showModal}
        readOnly
      />
      <div className={twMerge(styles.root, rootClass)}>
        <div className={styles.modalBox}>{modalType && MODAL[modalType]}</div>
      </div>
    </>
  );
}

const styles = {
  root: 'modal',
  modalBox: 'modal-box',
  modalToggler: 'modal-toggle',
};
