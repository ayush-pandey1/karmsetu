"use client";

import '@/app/globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/mainFreelancer/header';
import HeaderMobile from '@/components/mainFreelancer/header-mobile';
import MarginWidthWrapper from '@/components/mainFreelancer/margin-width-wrapper';
import PageWrapper from '@/components/mainFreelancer/page-wrapper';
import SideNav from '@/components/mainFreelancer/side-nav';
import { Provider } from 'react-redux'
import store from "../../(redux)/store/store"
import { SessionProvider } from "next-auth/react";
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children, }) {
  return (<html lang="en">
    <body className={`bg-white ${inter.className}`}>
      <div className="flex">
        <Provider store={store}>
          <SessionProvider>
            <SideNav />
            <main className="flex-1">
              <MarginWidthWrapper>
                <Header />
                <HeaderMobile />
                <PageWrapper>{children}</PageWrapper>
              </MarginWidthWrapper>
            </main>
          </SessionProvider>
        </Provider>
      </div>
    </body>
  </html>);
}
