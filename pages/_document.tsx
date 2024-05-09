import { Html, Head, Main, NextScript } from 'next/document';
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <script defer src='/js/jquery.min.js' />
      <body>
        <Main />
        <NextScript />
      </body>
      <script defer src='/js/global.js' />
    </Html>
  );
}
