import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/providers/auth.provider';
import ReactQueryProvider from '@/providers/react-query.provider';
import { fontSans } from '@/utils/font-utils';
import '@/utils/yup-extension-utils'; // Register custom yup methods globally
import { Metadata } from 'next';
import { ReactNode } from 'react';

import NextTopLoader from 'nextjs-toploader';
import '../styles/global.css';

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: { default: 'Workinley', template: '%s | Internal Tool' },
  description: 'Manage your projects at ease',
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en'>
      <body className={`${fontSans.variable} font-sans`} suppressHydrationWarning={true}>
        <ReactQueryProvider>
          <AuthProvider>
            <NextTopLoader />
            <main>
              <div>{children}</div>
            </main>
            <Toaster />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
