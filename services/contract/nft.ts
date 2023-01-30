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

  // async getAllNftByWallet(wallet: string) {}
}

// * mock calls below
// import axios from 'axios';

// export default class NftContract {
//   readonly #instance = axios.create({
//     baseURL: 'http://localhost:5003',
//   });

//   async mintEmptyNft(wallet: string) {
//     const nftResponse = (
//       await this.#instance({
//         method: 'POST',
//         url: '/nft',
//         data: { wallet },
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       })
//     ).data;

//     return nftResponse.id;
//   }

//   async getAllNftByWallet(wallet: string) {
//     const nftList = (
//       await this.#instance({
//         method: 'GET',
//         url: `/nft/user?wallet=${wallet}`,
//       })
//     ).data;

//     type Nft = {
//       id: string;
//       nft_name: string;
//       nft_area: number;
//       tile_count: number;
//       carbon_url: string;
//       start_date: string;
//       end_date: string;
//       farmId: string;
//       scientificName: string[];
//       plant_status: string;
//       wallet_address: string;
//     };

//     type NftObject = {
//       [id: string]: Nft;
//     };

//     return nftList.reduce((acc: NftObject, nft: Nft) => {
//       acc[nft.id] = nft;
//       return acc;
//     }, {});
//   }
// }

// // todo: need to replace with actual contract. This is just a mock
