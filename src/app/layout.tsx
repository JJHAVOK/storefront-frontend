import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { Header } from "@/components/Header"; // We will create this next
import { Footer } from "@/components/Footer"; // We will create this next

export const metadata: Metadata = {
  title: "PixelSolutions | Custom Web Development",
  description: "Full-Stack Solutions for Any Industry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* --- FONTS & ICONS --- */}
        {/* FontAwesome (from Homepage) */}
        <script src="https://use.fontawesome.com/releases/v6.3.0/js/all.js" crossOrigin="anonymous" defer></script>
        
        {/* RemixIcons (from Inner Pages) */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/3.5.0/remixicon.css" />
        
        {/* Google Fonts (Both Sets) */}
        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Roboto+Slab:400,100,300,700" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

        {/* --- GLOBAL CSS --- */}
        <link href="/assets/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/assets/css/styles.css" rel="stylesheet" />
      </head>
      <body id="page-top">
        
        {/* Global Header */}
        <Header />
        
        {/* Main Page Content */}
        {children}

        {/* Global Footer */}
        <Footer />

        {/* --- SCRIPTS --- */}
        <Script src="/assets/js/jquery.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/bootstrap.min.js" strategy="lazyOnload" />
        <Script src="/assets/js/main.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}