"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Lines from "@/components/Lines";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "../globals.css";
const inter = Inter({ subsets: ["latin"] });
import ToasterContext from "../context/ToastContext";
import { store } from '@/app/(redux)/store/store.js'
import { Provider } from 'react-redux'


export default function RootLayout({ children, }) {
    return (<html lang="en" suppressHydrationWarning>
      <body className={`dark:bg-black ${inter.className}`}>
        <Provider store={store}>
        <ThemeProvider enableSystem={false} attribute="class" defaultTheme="light">
          <Lines />
          <Header />
          <ToasterContext />
          {children}
          <Footer />
          <ScrollToTop />
        </ThemeProvider>
        </Provider>
      </body>
    </html>);
}