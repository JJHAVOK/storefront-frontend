import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "PixelForge Developer | Enterprise Software Solutions",
  description: "Professional software development and consulting services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* --- GLOBAL STYLESHEETS --- */}
        {/* These load from /public/assets/css/ */}
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/bootstrap-grid.min.css" />
        <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css" />
        
        {/* Your Custom Main Style */}
        <link rel="stylesheet" href="/assets/css/styles.css" />
        
        {/* Optional: Add Google Fonts here if your old index.html had them */}
      </head>
      <body className="antialiased">
        
        {/* The Main Page Content Injection */}
        {children}

        {/* --- GLOBAL SCRIPTS --- */}
        {/* Strategy='beforeInteractive' is crucial for jQuery to load before other scripts */}
        <Script src="/assets/js/jquery.min.js" strategy="beforeInteractive" />
        
        {/* Bootstrap loads after the page is interactive */}
        <Script src="/assets/js/bootstrap.min.js" strategy="lazyOnload" />
        
        {/* Your custom JS (animations, etc) */}
        <Script src="/assets/js/main.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}