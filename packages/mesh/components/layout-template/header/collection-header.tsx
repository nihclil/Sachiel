'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

import Button from '@/components/button'
import Icon from '@/components/icon'
import NotificationWrapper from '@/components/notification-wrapper'
import { LOGO_ICONS } from '@/constants/layout'
import { isUserLoggedIn, useUser } from '@/context/user'

export default function CollectionHeader() {
  const router = useRouter()
  const { user } = useUser()
  const isLoggedIn = isUserLoggedIn(user)

  return (
    <header className="fixed inset-x-0 top-0 z-layout h-[theme(height.header.default)] border-b bg-white sm:h-[theme(height.header.sm)]">
      {/* nested header to maintain the max width for screen width larger than 1440 */}
      <div className="mx-auto flex h-full max-w-[theme(width.maxContent)] justify-between p-2 sm:px-10 sm:py-3">
        {/* left side block */}
        <div className="flex gap-10">
          <Link
            href={LOGO_ICONS.mobile.href}
            className="GTM-header_click_mesh_logo flex items-center justify-center"
          >
            <Icon
              size={LOGO_ICONS.mobile.size}
              iconName={LOGO_ICONS.mobile.icon}
              className="sm:hidden"
            />
            <Icon
              size={LOGO_ICONS.nonMobile.size}
              iconName={LOGO_ICONS.nonMobile.icon}
              className="hidden sm:block"
            />
          </Link>
        </div>
        {/* right side block */}
        <div className="flex">
          <HeaderIconWrapper className="GTM-header_click_search_bar sm:hidden">
            {/* TODO: replace with correct path */}
            <Link href="/">
              <Icon size="2xl" iconName="icon-search" />
            </Link>
          </HeaderIconWrapper>
          {isLoggedIn ? (
            <NotificationWrapper />
          ) : (
            <div className="mx-3 my-1 flex items-center">
              <Button
                size="sm"
                color="white"
                text="登入"
                onClick={() => {
                  // TODO: handle on login here
                  router.push('/login')
                }}
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
