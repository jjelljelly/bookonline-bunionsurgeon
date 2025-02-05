import '../styles/globals.css'
import { setGoogleAnalytics } from '../components/GoogleAnalytics';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    setGoogleAnalytics();
  }, []);
  return <Component {...pageProps} />
}

export default MyApp
