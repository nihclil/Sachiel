'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

import Button from '@/components/button'
import Icon from '@/components/icon'
const DesktopSearchBar = dynamic(
  () => import('@/components/desktop-search-bar'),
  { ssr: false }
)

const MobileSearchWrapper = dynamic(
  () => import('@/components/mobile-search-wrapper'),
  { ssr: false }
)

import NotificationWrapper from '@/components/notification-wrapper'
import { LOGO_ICONS } from '@/constants/layout'
import { isUserLoggedIn, useUser } from '@/context/user'

export default function ArticleHeader({ showNav }: { showNav: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useUser()
  const isLoggedIn = isUserLoggedIn(user)

  const handleLoginButton = () => {
    localStorage.setItem('login-redirect', pathname)
    router.push('/login')
  }

  return (
    <header className="fixed inset-x-0 top-0 z-layout h-[theme(height.header.default)] border-b bg-white sm:h-[theme(height.header.sm)]">
      {/* nested header to maintain the max width for screen width larger than 1440 */}
      <div className="mx-auto flex h-full max-w-[theme(width.maxContent)] justify-between p-2 sm:px-10 sm:py-3">
        {/* left side block */}
        <div className="flex gap-10">
          <div className="flex">
            <button
              className="flex size-11 items-center justify-center"
              onClick={showNav}
            >
              <Icon size="l" iconName="icon-hamburger-menu" />
            </button>
            <Link href={LOGO_ICONS.nonMobile.href}>
              <Icon
                size={LOGO_ICONS.nonMobile.size}
                iconName={LOGO_ICONS.nonMobile.icon}
              />
            </Link>
          </div>
          <DesktopSearchBar className="hidden sm:flex" />
        </div>
        {/* right side block */}
        <div className="flex">
          <HeaderIconWrapper className="sm:hidden">
            <MobileSearchWrapper />
          </HeaderIconWrapper>
          {isLoggedIn ? (
            <NotificationWrapper />
          ) : (
            <div className="mx-3 my-1 flex items-center">
              <Button
                size="sm"
                color="white"
                text="登入"
                onClick={handleLoginButton}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

const HeaderIconWrapper = ({
  children,
  className = '',
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
}) => {
  return (
    <div
      className={twMerge(
        'flex h-11 w-11 cursor-pointer items-center justify-center hover:rounded-[50%] hover:bg-primary-100 active:rounded-[50%] active:bg-primary-100',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
