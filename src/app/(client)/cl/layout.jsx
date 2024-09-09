"use client";

import '@/app/globals.css';


import { Inter } from 'next/font/google';
import Header from '@/components/mainClient/header';
import HeaderMobile from '@/components/mainClient/header-mobile';
import MarginWidthWrapper from '@/components/mainClient/margin-width-wrapper';
import PageWrapper from '@/components/mainClient/page-wrapper';
import SideNav from '@/components/mainClient/side-nav';
const inter = Inter({ subsets: ['latin'] });
import { Provider, useDisispatch } from 'react-redux'
import store from "../../(redux)/store/store";

import { SessionProvider } from "next-auth/react";
import { getLocaleCookie } from '../../../utils/cookieUtils';
import { setLanguage } from '../../(redux)/features/languageSlice';

export default function RootLayout({ children, }) {
  const locale = getLocaleCookie(); // Retrieve locale from cookies
  store.dispatch(setLanguage(locale));

  return (<html lang="en">
    <body className={`bg-white ${inter.className}`}>
      <div className="flex">
        <SessionProvider>
          <Provider store={store}>
            <SideNav />
            <main className="flex-1">
              <MarginWidthWrapper>
                <Header />
                <HeaderMobile />
                <PageWrapper>{children}</PageWrapper>
              </MarginWidthWrapper>
            </main>
          </Provider>
        </SessionProvider>
      </div>
    </body>
  </html>);
}
