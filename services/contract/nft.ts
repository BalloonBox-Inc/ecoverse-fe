import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js';
import { Wallet } from '@solana/wallet-adapter-react';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';

// todo: this will be env variables
const secret = [
  191, 21, 188, 83, 17, 32, 235, 108, 239, 84, 123, 109, 157, 216, 252, 157, 75,
  90, 76, 150, 137, 25, 113, 20, 225, 60, 93, 214, 41, 90, 97, 43, 251, 20, 62,
  11, 102, 105, 219, 152, 240, 145, 180, 185, 238, 219, 156, 10, 217, 228, 53,
  30, 230, 146, 39, 116, 48, 27, 187, 128, 124, 196, 63, 67,
];
const CANDY_MACHINE_ID = 'B2iBjQQyJMvTAaHD4QPM1NZvpnATG3LNSsubciuk3EBQ';

export default class NftContract {
  readonly #thirdPartyWallet = Keypair.fromSecretKey(new Uint8Array(secret));

  async mintEmptyNft(connection: Connection, wallet: Wallet) {
    const metaplex = Metaplex.make(connection).use(
      walletAdapterIdentity(wallet.adapter)
    );
    const candyMachine = await metaplex
      .candyMachines()
      .findByAddress({ address: new PublicKey(CANDY_MACHINE_ID) });

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
