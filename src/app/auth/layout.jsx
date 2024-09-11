"use client";
import Lines from "@/components/Lines";
import ToasterContext from "../context/ToastContext";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "../globals.css";
import { SessionProvider } from "next-auth/react";
import NextNProgress from 'nextjs-progressbar';
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children, }) {
  return (<html lang="en" suppressHydrationWarning>
    <body className={`dark:bg-black ${inter.className}`}>
      <SessionProvider>
        <ThemeProvider enableSystem={false} attribute="class" defaultTheme="light">
          <Lines />
          <ToasterContext />
          <NextNProgress />
          {children}
          <ScrollToTop />
        </ThemeProvider>
      </SessionProvider>
    </body>
  </html>);
}
