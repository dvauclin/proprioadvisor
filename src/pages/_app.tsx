import type { AppProps } from 'next/app';
import Head from 'next/head';
import Providers from '@/components/providers/Providers';
import '@/app/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" />
      </Head>
      <Providers>
        <Component {...pageProps} />
      </Providers>
    </>
  );
}
