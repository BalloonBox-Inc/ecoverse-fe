import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const WalletConnectButton = () => {
  return (
    <div>
      <div className="w-full mx-1 text-primary hover:text-secondary">
        <WalletMultiButton />
      </div>
    </div>
  );
};

export default WalletConnectButton;
