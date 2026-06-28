import { Inter } from 'next/font/google';
import '../globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import { NexusThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import SWRegistration from '@/components/SWRegistration';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {getTranslations} from 'next-intl/server';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata({params}) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Index'});
 
  return {
    title: t('title'),
    description: t('metaDescription'),
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'Nexus Sales Portal',
    },
    icons: {
      icon: [
        { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [
        { url: '/icon-180x180.png', sizes: '180x180', type: 'image/png' },
      ],
    },
  };
}

export const viewport = {
  themeColor: '#000000',
};

export default async function RootLayout({ children, params }) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="nexus-theme" enableColorScheme>
            <NexusThemeProvider>
              <ToastProvider>
                <div className="min-h-screen flex flex-col">
                  {children}
                </div>
                <SWRegistration />
              </ToastProvider>
            </NexusThemeProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

