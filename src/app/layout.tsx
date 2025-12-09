import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header"; 
import { Footer } from "@/components/Footer"; 

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
        
        {/* --- ICONS --- */}
        {/* Use CSS version instead of JS to prevent hydration mismatch */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/3.5.0/remixicon.css" />
        
        {/* --- FONTS --- */}
        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Roboto+Slab:400,100,300,700" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

        {/* --- GLOBAL CSS --- */}
        <link href="/assets/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/assets/css/styles.css" rel="stylesheet" />
      </head>
      <body id="page-top">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}