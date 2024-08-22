"use client";


import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "../globals.css";
const inter = Inter({ subsets: ["latin"] });
import ToasterContext from "../context/ToastContext";
import ScrollToTop from "@/components/ScrollToTop";

import { SessionProvider } from "next-auth/react";


export default function RootLayout({ children, }) {
  return (<html lang="en" suppressHydrationWarning className="no-scrollbar">
    <body className={`dark:bg-black ${inter.className}`}>
      <ThemeProvider enableSystem={false} attribute="class" defaultTheme="light">
        <SessionProvider>
          <ToasterContext />
          {children}
          <ScrollToTop />
        </SessionProvider>
      </ThemeProvider>
    </body>
  </html>);
}
