import '@/app/globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/main/header';
import HeaderMobile from '@/components/main/header-mobile';
import MarginWidthWrapper from '@/components/main/margin-width-wrapper';
import PageWrapper from '@/components/main/page-wrapper';
import SideNav from '@/components/main/side-nav';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children, }) {
    return (<html lang="en">
      <body className={`bg-white ${inter.className}`}>
        <div className="flex">
          <SideNav />
          <main className="flex-1">
            <MarginWidthWrapper>
              <Header />
              <HeaderMobile />
              <PageWrapper>{children}</PageWrapper>
            </MarginWidthWrapper>
          </main>
        </div>
      </body>
    </html>);
}