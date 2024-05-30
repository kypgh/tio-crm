import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
  render() {
    return (
      <Html>
        <Head>
          {/* Google */}
          <meta name="title" content="Flo CRM" />
          <meta
            name="description"
            content="TIOmarkets Clients Relationship Manager for CTrader"
          />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://tio-crm.vercel.app/" />
          <meta property="og:title" content="TIOmarkets" />
          <meta
            property="og:description"
            content="TIOmarkets Clients Relationship Manager for CTrader"
          />
          <meta property="og:image" content="" />
          <meta property="og:image:alt" content="Flo CRM" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content="https://tio-crm.vercel.app/" />
          <meta name="twitter:title" content="TIOmarkets" />
          <meta
            name="twitter:description"
            content="TIOmarkets Clients Relationship Manager for CTrader"
          />
          <meta name="twitter:image" content="" />
          <meta name="twitter:image:alt" content="Flo CRM" />
        </Head>
        <body>
          <div id="tooltipsContainer"></div>
          <div id="dropdownContainer"></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
