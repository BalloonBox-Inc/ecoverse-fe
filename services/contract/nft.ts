import axios from 'axios';

export default class NftContract {
  readonly #instance = axios.create({
    baseURL: 'http://localhost:5003',
  });

  async mintEmptyNft(wallet: string) {
    const nftResponse = (
      await this.#instance({
        method: 'POST',
        url: '/nft',
        data: { wallet },
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).data;

    return nftResponse.id;
  }

  async getAllNftByWallet(wallet: string) {
    const nftList = (
      await this.#instance({
        method: 'GET',
        url: `/nft/user?wallet=${wallet}`,
      })
    ).data;

    type Nft = {
      id: string;
      nft_name: string;
      nft_area: number;
      tile_count: number;
      carbon_url: string;
      start_date: string;
      end_date: string;
      farmId: string;
      scientificName: string[];
      plant_status: string;
      wallet_address: string;
    };

    type NftObject = {
      [id: string]: Nft;
    };

    return nftList.reduce((acc: NftObject, nft: Nft) => {
      acc[nft.id] = nft;
      return acc;
    }, {});
  }
}

// todo: need to replace with actual contract. This is just a mock
