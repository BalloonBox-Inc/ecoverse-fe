import * as config from '@config/index';
import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js';
import { Wallet } from '@solana/wallet-adapter-react';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';

export default class NftContract {
  readonly #thirdPartyWallet;

  constructor() {
    if (!config.SECRET || !config.CANDY_MACHINE_ID)
      throw new Error('Missing secret and/or candy machine id');
    this.#thirdPartyWallet = Keypair.fromSecretKey(
      new Uint8Array(config.SECRET)
    );
  }

  async mintEmptyNft(connection: Connection, wallet: Wallet) {
    const metaplex = Metaplex.make(connection).use(
      walletAdapterIdentity(wallet.adapter)
    );
    const candyMachine = await metaplex
      .candyMachines()
      .findByAddress({ address: new PublicKey(config.CANDY_MACHINE_ID) });

    const { nft } = await metaplex.candyMachines().mint({
      candyMachine,
      collectionUpdateAuthority: this.#thirdPartyWallet.publicKey,
      guards: { thirdPartySigner: { signer: this.#thirdPartyWallet } },
    });

    return nft.address.toString();
  }

  async getAllNftByWallet(connection: Connection, wallet: Wallet) {
    const metaplex = Metaplex.make(connection).use(
      walletAdapterIdentity(wallet.adapter)
    );

    const allNfts = await metaplex
      .nfts()
      .findAllByOwner({ owner: metaplex.identity().publicKey });

    const mintAddressArray = await allNfts.map((nft: any) => nft.mintAddress);

    const nftMetaDataArray = await Promise.all(
      mintAddressArray.map(
        async (mintAddress) => await metaplex.nfts().findByMint({ mintAddress })
      )
    );

    return nftMetaDataArray;
  }
}
