import '@/styles/global.css'

import { GoogleTagManager } from '@next/third-parties/google'
import type { Metadata } from 'next'
import { Noto_Sans_TC } from 'next/font/google'

import AdsenseScript from '@/components/adsense-script'
import UserBehaviorLogger from '@/components/user-behavior-logger'
import {
  GTM_ID,
  SITE_DESCRIPTION,
  SITE_OG_IMAGE,
  SITE_TITLE,
  SITE_URL,
} from '@/constants/config'
import { PickModalProvider } from '@/context/pick-modal'
import { PickersModalProvider } from '@/context/pickers-modal'
import { ToastProvider } from '@/context/toast'
import { UserProvider } from '@/context/user'

import RootLayoutWrapper from './_components/root-layout-wrapper'
import { getCurrentUser } from './actions/auth'

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_TITLE,
    locale: 'zh_TW',
    images: {
      url: SITE_OG_IMAGE,
      width: 1200,
      height: 630,
    },
  },
}

const notoSans = Noto_Sans_TC({
  subsets: ['latin'],
  display: 'swap',
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getCurrentUser()

  return (
    <html lang="zh-Hant" className={notoSans.className}>
      <GoogleTagManager gtmId={GTM_ID} />
      <AdsenseScript />
      <body>
        <UserProvider user={user}>
          <ToastProvider>
            <PickModalProvider>
              <PickersModalProvider>
                <RootLayoutWrapper>
                  <UserBehaviorLogger />
                  {children}
                </RootLayoutWrapper>
              </PickersModalProvider>
            </PickModalProvider>
          </ToastProvider>
        </UserProvider>
      </body>
    </html>
  )
}
