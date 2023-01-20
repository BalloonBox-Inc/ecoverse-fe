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
}

// todo: need to replace with actual contract. This is just a mock
