import ChevronLeftIcon from '@components/Icons/ChevronLeftIcon';
import EditIcon from '@components/Icons/EditIcon';
import Layout from '@components/layouts/Layout';
import { SendTransaction } from '@components/SendTransaction';
import { getStaticImageUrl } from '@services/map';
import withAuth from 'hoc/withAuth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

function Checkout() {
  const router = useRouter();
  const [title, setTitle] = useState('Unnamed Selection');
  const [editable, setEditable] = useState(false);
  const [success, setSuccess] = useState(false);
  const checkmark = '../assets/images/checkmark.svg';
  const handleEditTitle = () => {
    setEditable(!editable);
  };
  const placeholderImg = getStaticImageUrl(
    '102.82019076691307',
    '17.626501946609892'
  );
  return (
    <Layout>
      <div className={styles.root}>
        <button
          className={styles.backButton}
          onClick={() => router.replace('/')}
        >
          <ChevronLeftIcon className={styles.chevronIcon} /> BACK TO MAP
        </button>
        <h1 className="my-5">Checkout</h1>
        {!success ? (
          <>
            <h2 className={styles.summaryText}>Summary</h2>

            <div className={styles.cardContainer}>
              <figure className={styles.imageContainer}>
                <Image fill src={placeholderImg} alt="placeholder" />
              </figure>
              <div className={styles.cardBody}>
                <div className={styles.titleContainer}>
                  <div>
                    <div className="flex items-center">
                      {editable ? (
                        <input
                          value={title}
                          onChange={(e) => {
                            setTitle(e.target.value);
                          }}
                          className="input input-bordered"
                        />
                      ) : (
                        <h2 className="text-3xl">{title}</h2>
                      )}
                      <div className="cursor-pointer" onClick={handleEditTitle}>
                        {' '}
                        {editable ? (
                          <button className="btn btn-primary">save</button>
                        ) : (
                          <EditIcon className={styles.editIcon} />
                        )}
                      </div>
                    </div>
                    <p className="text-neutral text-lg">
                      Chiang Mai, Sri Trang Thailand
                    </p>
                  </div>
                  <div>
                    <Link href="/" className="text-primary">
                      Edit selection
                    </Link>
                  </div>
                </div>

                <div className={styles.statsContainer}>
                  <div className={styles.statsItem}>
                    {' '}
                    Total selected tiles:{' '}
                    <span className={styles.statsNumber}>620</span>
                  </div>
                  <div className={styles.statsItem}>
                    {' '}
                    Total fill calculated area:{' '}
                    <span className={styles.statsNumber}>620</span>
                  </div>
                  <div className={styles.statsItem}>
                    {' '}
                    Species:
                    <span className={styles.statsNumber}>620</span>
                  </div>
                  <div className={styles.statsItem}>
                    {' '}
                    Genus: <span className={styles.statsNumber}>620</span>
                  </div>{' '}
                  <div className={styles.statsItem}>
                    {' '}
                    Plant Status:
                    <span className={styles.statsNumber}>620</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.ctaContainer}>
              <div className={styles.valueContainer}>
                <span className="mr-2">Total: </span>{' '}
                <div>
                  <span className={styles.totalValue}>40 SOL</span>
                  <span className={styles.valueInUsd}>≈$987</span>
                </div>
              </div>
              <SendTransaction setSuccess={setSuccess} success={success} />
            </div>
          </>
        ) : (
          <div className="bg-white">
            <Image src={checkmark} width={30} height={30} alt="checkmark" />
            <h1>Payment Successful</h1>
            <div className="w-1/2">
              Your payment has been successful! Your forest information will be
              updated within couple minutes. Please check the status in my
              forest page.
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default withAuth(Checkout);

const styles = {
  root: 'px-10 lg:px-20 py-10',
  backButton: 'flex items-center text-primary font-semibold',
  chevronIcon: 'h-3 w-3 fill-primary mr-1',
  summaryText: 'font-medium text-neutral text-xl my-4',
  cardContainer: 'card lg:card-side bg-base-100 shadow-xl',
  cardBody: 'card-body px-10',
  imageContainer: 'relative w-full h-96 lg:w-96',
  titleContainer: 'flex lg:flex-row flex-col  justify-between items-start',
  statsContainer: 'flex flex-col gap-1 py-4 text-lg',
  statsItem: 'flex items-center',
  statsNumber: 'text-primary ml-1',
  editIcon: 'h-5 w-5 fill-primary ml-2',
  valueContainer: 'flex items-center text-xl my-4',
  totalValue: 'text-3xl font-bold',
  valueInUsd: 'text-sm text-neutral font-sans ml-2',
  ctaContainer: 'flex flex-col items-end mt-5',
};
