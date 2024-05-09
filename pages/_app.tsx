import '@/vendor/bootstrap-5.2.2/css/bootstrap.min.css';
// import '@/vendor/bootstrap-5.2.2/css/bootstrap-grid.css';
import '@/styles/fonts.css';
import '@/styles/index.css'
import '@/styles/base.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <main className={inter.variable}>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
