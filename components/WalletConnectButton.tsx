import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const WalletConnectButton = () => {
  return (
    <div className={styles.walletButton}>
      <WalletMultiButton />
    </div>
  );
};

export default WalletConnectButton;

const styles = {
  walletButton: 'mx-1 text-primary hover:text-secondary',
};
