"use client";

import { Noto_Sans_JP, Roboto } from "next/font/google";
import "@/styles/_base.scss";

const notoSansJp = Noto_Sans_JP({ weight: ["400", "700"], subsets: ["latin"] });
const roboto = Roboto({ weight: ["400", "700"], subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta property="og:title" content="Hellooo.cards" />
        <meta
          property="og:description"
          content="リアルとSNSをつなぐ名前シール"
        />
        <meta property="og:image" content="/images/og-image.png" />
        <meta property="og:url" content="https://www.hellooo.cards/" />
        <style jsx global>{`
          html {
            font-family: ${roboto.style.fontFamily},
              ${notoSansJp.style.fontFamily};
          }
        `}</style>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-K4PLVVEK9B"
        ></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-K4PLVVEK9B');
          `}
        </script>
      </head>
      <body>{children}</body>
    </html>
  );
}
