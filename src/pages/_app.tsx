import type { AppProps } from 'next/app';
import Head from 'next/head';
import Providers from '@/components/providers/Providers';
import '@/app/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </Head>
      <Providers>
        <Component {...pageProps} />
      </Providers>
    </>
  );
}
