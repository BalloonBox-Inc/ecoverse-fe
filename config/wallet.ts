import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export const getNetworkConfig = (env: string) => {
  switch (env) {
    case 'production':
      return WalletAdapterNetwork.Mainnet;
    case 'test':
      return WalletAdapterNetwork.Testnet;
    default:
      return WalletAdapterNetwork.Devnet;
  }
};

export default getNetworkConfig;
