import Head from 'next/head';
import { GetStaticProps } from 'next';
import SubscribeButton from '../components/SubscribeButton';
import styles from './home.module.scss';
import { stripe } from '../services/stripe';

interface IHomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1J2QJpHGKNEqTW1Kg6Yb5uv8');
  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  };
  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours,
  };
};

const Home: React.FC<IHomeProps> = ({ product }) => {
  return (
    <>
      <Head>
        <title>Inicio | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the <span>React</span> Word.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
};
export default Home;
