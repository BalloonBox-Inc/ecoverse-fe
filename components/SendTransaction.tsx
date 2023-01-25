import { notify } from '@plugins/notify';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  Keypair,
  SystemProgram,
  Transaction,
  TransactionSignature,
} from '@solana/web3.js';
import * as bs58 from 'bs58';
import { useCallback } from 'react';

export const SendTransaction = ({ setSuccess, success }: any) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const recipientPrivateKey = process.env.RECIPIENT_PRIVATE_KEY as string;
  console.log(success);
  const transfer = useCallback(async () => {
    if (!publicKey) {
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
      signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'processed');
      notify('Success', 'success');
      setSuccess(true);
    } catch (err: any) {
      notify('Something went wrong. Please try again', 'error');
    }
  }, [publicKey, sendTransaction, connection]);

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
