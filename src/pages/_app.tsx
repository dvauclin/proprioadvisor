import type { AppProps } from 'next/app';
import Head from 'next/head';
import Providers from '@/components/providers/Providers';
import '@/app/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7FFF00" />
        {/* Force cache refresh for favicon */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        {/* Additional favicon cache busting */}
        <link rel="icon" href="/favicon.svg?v=1757006368914" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.ico?v=1757006368914" type="image/x-icon" />
      </Head>
      <Providers>
        <Component {...pageProps} />
      </Providers>
    </>
  );
}
