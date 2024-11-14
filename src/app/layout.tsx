import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { AlertProvider } from "@/context/AlertContext";
import Script from "next/script";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Fintech",
  description: "A fintech application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-white">
      <head>
        <Script src="https://kit.fontawesome.com/d7a32dadfb.js" crossOrigin="anonymous" strategy="lazyOnload" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}  text-zinc-950 antialiased lg:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:lg:bg-zinc-950 h-full`}>
        <AlertProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
