"use client";
// import Footer from "../../components/Footer/index";
// import Header from "../../components/Header/index";
// import Lines from "../../components/Lines/index";
// import ScrollToTop from "../../components/ScrollToTop/index";
import store from '../(redux)/store/store'
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Lines from "@/components/Lines";
import ScrollToTop from "@/components/ScrollToTop";
//import { store } from '@/app/(redux)/store/store.js'
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "../globals.css";
import { SessionProvider } from "next-auth/react";
import ToasterContext from "../context/ToastContext";
import { Provider } from 'react-redux'
import NextTopLoader from 'nextjs-toploader';


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`dark:bg-black ${inter.className}`}>
        {/* <Provider store={store}> */}
          <SessionProvider>
            <ThemeProvider enableSystem={false} attribute="class" defaultTheme="light">
            <NextTopLoader color="#8b5cf6" />
              <Lines />
              <Header />
              <ToasterContext />
              {children}
              <Footer />
              <ScrollToTop />
            </ThemeProvider>
          </SessionProvider>
        {/* </Provider> */}
      </body>
    </html>
  );
}
