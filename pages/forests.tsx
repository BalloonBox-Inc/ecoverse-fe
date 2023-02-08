import Layout from '@components/layouts/Layout';
import axios from '@plugins/axios';
import { ecoverseLogin } from '@services/api/jwt';
import contract from '@services/contract';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import withAuth from 'hoc/withAuth';
import React from 'react';
import { useEffect, useState } from 'react';

function Forests() {
  const { connection } = useConnection();
  const { wallet } = useWallet();
  const [co2Sum, setco2Sum] = useState(0);

  useEffect(() => {
    const getCo2Tons = async () => {
      const requestLogin = await ecoverseLogin();
      const JWT = `Bearer ${requestLogin}`;

      const allNfts = await contract.nft.getAllNftByWallet(connection, wallet!);
      const updatedNfts = allNfts.filter((nft) => nft.json?.attributes);
      const activeNfts = updatedNfts.filter(
        (nft: any) => nft.json?.attributes[6].value === 'Active'
      );
      const activeNftsAddresses = activeNfts.map((nft) =>
        nft.mint.address.toString()
      );

      const carbonArray = await Promise.all(
        activeNftsAddresses.map(
          async (address) =>
            await axios({
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: JWT,
                accept: 'application/json',
              },
              url: `${process.env.BACKEND_URL}/api/v1/nft/${address}`,
            })
        )
      );

      const co2Array = await carbonArray.map((nft) => nft.data.data.co2Tons);
      const co2Sum = await co2Array.reduce((x, y) => {
        return x + y;
      });
      setco2Sum(co2Sum);
    };

    getCo2Tons();
  }, []);

  return (
    <Layout>
      <div className={styles.root}>
        <h1 className="my-5">My Forests</h1>
        <div className="text-lg">
          Total CO2 seqeustered:{co2Sum ? co2Sum : ' loading..'}
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(Forests);

const styles = {
  root: 'px-10 lg:px-20 py-10',
};
