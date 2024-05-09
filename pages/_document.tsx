import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <script src='/js/jquery.min.js' />
      <body>
        <Main />
        <NextScript />
      </body>
      <script src='/js/global.js' />
    </Html>
  );
}
