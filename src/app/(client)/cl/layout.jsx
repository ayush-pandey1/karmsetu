"use client";

import '@/app/globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/mainClient/header';
import HeaderMobile from '@/components/mainClient/header-mobile';
import MarginWidthWrapper from '@/components/mainClient/margin-width-wrapper';
import PageWrapper from '@/components/mainClient/page-wrapper';
import SideNav from '@/components/mainClient/side-nav';
const inter = Inter({ subsets: ['latin'] });
import { Provider } from 'react-redux'
import store from "../../(redux)/store/store"

export default function RootLayout({ children, }) {
    return (<html lang="en">
      <body className={`bg-white ${inter.className}`}>
        <div className="flex">
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
        </div>
      </body>
    </html>);
}
