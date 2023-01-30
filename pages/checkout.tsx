import checkmark from '@assets/images/checkmark.svg';
import ChevronLeftIcon from '@components/Icons/ChevronLeftIcon';
import EditIcon from '@components/Icons/EditIcon';
import Layout from '@components/layouts/Layout';
import { SendTransaction } from '@components/SendTransaction';
import { RootState } from '@plugins/store';
import { setAreaName } from '@plugins/store/slices/purchase';
import { getStaticImageUrl } from '@services/map';
import { convertUsdtoSol, m2ToHaFormat } from '@utils/helper';
import withAuth from 'hoc/withAuth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function Checkout() {
  const router = useRouter();
  const [editable, setEditable] = useState(false);
  const [success, setSuccess] = useState(false);
  const [totalValueInSol, setTotalValueInSol] = useState<number | undefined>(
    undefined
  );
  const dispatch = useDispatch();
  const tiles = useSelector((state: RootState) => state.purchase);
  const { tilesToPurchase, center, filledArea, areaName } = tiles;
  const isCartEmpty = tilesToPurchase.length === 0;
  const filledAreaInHa = Number(m2ToHaFormat(Number(filledArea)));
  const totalValueInUsd: number =
    filledAreaInHa * tilesToPurchase[0]?.data.hectareUsd;

  useEffect(() => {
    async function getSolValue() {
      const valueInSol = await convertUsdtoSol(totalValueInUsd);
      setTotalValueInSol(valueInSol);
    }
    getSolValue();
  }, [totalValueInUsd, totalValueInSol]);

  const handleEditTitle = () => {
    setEditable(!editable);
  };

  const placeholderImg = getStaticImageUrl(center?.lng!, center?.lat!);
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
        {isCartEmpty && (
          <div>
            Your cart is empty.{' '}
            <Link className={styles.link} href="/">
              Go to map
            </Link>{' '}
          </div>
        )}
        {!isCartEmpty && !success && (
          <>
            <h2 className={styles.summaryText}>Summary</h2>

            <div className={styles.cardContainer}>
              <figure className={styles.imageContainer}>
                <Image fill src={placeholderImg} alt="placeholder" />
              </figure>
              <div className={styles.cardBody}>
                <div className={styles.titleContainer}>
                  <div>
                    <div className={styles.inputContainer}>
                      {editable ? (
                        <input
                          value={areaName}
                          onChange={(e) => {
                            dispatch(setAreaName(e.target.value));
                          }}
                          className={styles.inputBox}
                        />
                      ) : (
                        <h2 className="text-3xl">
                          {areaName === '' ? 'Unnamed Selection' : areaName}
                        </h2>
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
                      {tilesToPurchase[0].data.province},{' '}
                      {tilesToPurchase[0].data.groupScheme}
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
                    <span className={styles.statsNumber}>
                      {tilesToPurchase.length}
                    </span>
                  </div>
                  <div className={styles.statsItem}>
                    {' '}
                    Total filled area:{' '}
                    <span className={styles.statsNumber}>
                      {m2ToHaFormat(Number(filledArea))} ha
                    </span>
                  </div>
                  <div className={styles.statsItem}>
                    {' '}
                    Price per hectare:{' '}
                    <span className={styles.statsNumber}>
                      {`${'$' + tilesToPurchase[0]?.data.hectareUsd}`}
                    </span>
                  </div>
                  <div className={styles.statsItem}>
                    {' '}
                    Species:
                    <span className={styles.statsNumber}>
                      {tilesToPurchase[0].data.productGroup}
                    </span>
                  </div>
                  <div className={styles.statsItem}>
                    {' '}
                    Plant Status:
                    <span className={styles.statsNumber}>
                      {tilesToPurchase[0].data.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.ctaContainer}>
              <div className={styles.valueContainer}>
                <span className="mr-2">Total: </span>{' '}
                <div>
                  <span className={styles.totalValue}>
                    {totalValueInSol?.toFixed(2)} SOL
                  </span>
                  <span className={styles.valueInUsd}>
                    ≈$
                    {totalValueInUsd.toFixed(2)}
                  </span>
                </div>
              </div>
              <SendTransaction
                setSuccess={setSuccess}
                tiles={tiles}
                nftValueInSol={totalValueInSol}
              />
            </div>
          </>
        )}
        {success && (
          <div className={styles.successPage}>
            <Image src={checkmark} alt="checkmark" width={50} height={50} />
            <h1 className="text-center">Payment Successful</h1>
            <div className="text-center">
              Your payment has been successful!
              <br /> Your forest information will be updated within couple
              minutes.
              <br /> Please check the status in my forest page.
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
  inputContainer: 'flex items-center',
  inputBox: 'input input-bordered',
  statsContainer: 'flex flex-col gap-1 py-4 text-lg',
  statsItem: 'flex items-center',
  statsNumber: 'text-primary ml-1',
  editIcon: 'h-5 w-5 fill-primary ml-2',
  valueContainer: 'flex items-center text-xl my-4',
  totalValue: 'text-3xl font-bold',
  valueInUsd: 'text-sm text-neutral font-sans ml-2',
  ctaContainer: 'flex flex-col items-end mt-5',
  link: 'link link-primary',
  successPage:
    'bg-white py-10 px-20 justify-center flex flex-col items-center gap-3',
};
