import { notify } from '@plugins/notify';
import contract from '@services/contract';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  Keypair,
  SystemProgram,
  Transaction,
  TransactionSignature,
} from '@solana/web3.js';
import * as bs58 from 'bs58';
import { Dispatch, SetStateAction, useCallback } from 'react';

interface Props {
  setSuccess: Dispatch<SetStateAction<boolean>>;
}

export const SendTransaction = ({ setSuccess }: Props) => {
  const { connection } = useConnection();
  const { wallet, publicKey, sendTransaction } = useWallet();
  const recipientPrivateKey = process.env.RECIPIENT_PRIVATE_KEY as string;
  const transfer = useCallback(async () => {
    if (!publicKey || !wallet) {
      notify('Wallet not connected!', 'error');
      return;
    }

    let signature: TransactionSignature = '';
    try {
      const recipientKeypair = Keypair.fromSecretKey(
        bs58.decode(recipientPrivateKey)
      );
      const recipient = recipientKeypair.publicKey;
      const amount = 1;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey, // user's pubkey
          toPubkey: recipient,
          lamports: amount,
        })
      );

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();

      signature = await sendTransaction(transaction, connection, {
        minContextSlot,
      });

      // ! deprecated method
      // await connection.confirmTransaction(signature, 'processed');

      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });

      const nftId = await contract.nft.mintEmptyNft(connection, wallet);
      console.log(
        '🚀 ~ file: SendTransaction.tsx:62 ~ transfer ~ nftId',
        nftId
      );

      notify('Success', 'success');
      setSuccess(true);
    } catch (err: any) {
      notify('Something went wrong. Please try again', 'error');
    }
  }, [
    publicKey,
    recipientPrivateKey,
    sendTransaction,
    connection,
    wallet,
    setSuccess,
  ]);

  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={transfer}
        disabled={!publicKey}
      >
        <div className="hidden group-disabled:block ">Wallet not connected</div>
        <span className="block group-disabled:hidden">Complete Purchase</span>
      </button>
    </div>
  );
};
