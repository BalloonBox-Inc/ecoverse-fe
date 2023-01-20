import { clearModalType } from '@plugins/store/slices/modal';
import { clearTilesToPurchase } from '@plugins/store/slices/purchase';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

export default function LoginModal() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(clearModalType());
    router.push('/login');
  };

  const handleCancelLogin = () => {
    dispatch(clearTilesToPurchase());
    dispatch(clearModalType());
  };
  return (
    <>
      <h3 className={styles.header}>Login</h3>
      <p className={styles.content}>
        You are currently on guest mode. If you want to proceed on checkout,
        please log in.
      </p>
      <div className={styles.action}>
        <button className={styles.secondaryButton} onClick={handleCancelLogin}>
          Stay on guest mode
        </button>
        <button className={styles.loginButton} onClick={handleLogin}>
          Login
        </button>
      </div>
    </>
  );
}

const styles = {
  header: 'font-bold text-lg',
  content: 'py-4',
  action: 'modal-action',
  loginButton: 'btn btn-primary',
  secondaryButton: 'btn btn-ghost',
};
