import { AppProps } from 'next/app';
import { Header } from '../components/Header';
import '../styles/global.scss';
const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Header />
      <Component {...pageProps} />{' '}
    </>
  );
};

export default MyApp;
