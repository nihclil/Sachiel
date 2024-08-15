'use client'
import '@/styles/global.css'

import { usePathname, useRouter } from 'next/navigation'

import Icon from '@/components/icon'
import Footer from '@/components/layout-template/footer'
import Header from '@/components/layout-template/header'
import Nav from '@/components/layout-template/nav'
import { FOLLOW_LIST_PATHS } from '@/constants/page-style'
import { useUser } from '@/context/user'
import useWindowDimensions from '@/hooks/use-window-dimension'

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathName = usePathname()
  const { user: currentUser } = useUser()
  const pathNameList = pathName.split('/')
  const { width } = useWindowDimensions()
  const userId = pathNameList.pop()
  const isSelf = userId === currentUser?.customId
  const router = useRouter()
  const backToPreviousPage = () => {
    router.back()
  }

  const hasUniqueHeader = (pathName: string): boolean => {
    // NOTE: in some path do not show the header
    const hasTargetPath = FOLLOW_LIST_PATHS.some((path) =>
      pathName.endsWith(path)
    )
    return !hasTargetPath
  }

  const hasNav = (pathName: string, width: number): boolean => {
    const hasTargetPath = FOLLOW_LIST_PATHS.some((path) =>
      pathName.endsWith(path)
    )
    const isMobileWidth = width < 768

    return !hasTargetPath || !isMobileWidth
  }
  return (
    <div className="flex grow flex-col">
      <div className="hidden sm:block">
        <Header type="stateful" />
      </div>
      <div className="primary-container py-0 sm:pt-[68px]">
        {hasUniqueHeader(pathName) && (
          <div className="flex h-[theme(height.header.default)] sm:h-[theme(height.header.sm)]">
            <div className="flex max-w-[680px] grow items-center justify-between px-5">
              <div className="flex items-center gap-5">
                {!isSelf && (
                  <button
                    type="button"
                    className="p-3 pl-0"
                    onClick={backToPreviousPage}
                  >
                    <Icon
                      iconName="icon-chevron-left"
                      size={{ width: 20, height: 20 }}
                    />
                  </button>
                )}
                <p className="list-title hidden place-self-center sm:block">
                  {userId}
                </p>
              </div>
              <p className="list-title block place-self-center sm:hidden">
                {userId}
              </p>
              <button
                type="button"
                className="place-self-end self-center p-3"
                // TODO: more function
              >
                <Icon
                  iconName="icon-more-horiz"
                  size={{ width: 24, height: 24 }}
                />
              </button>
            </div>
          </div>
        )}
        <div className="flex grow flex-col bg-multi-layer-light">
          {children}
        </div>
        <div className="hidden sm:block">
          <Footer />
        </div>
      </div>
      {hasNav(pathName, width) && <Nav type="default" />}
    </div>
  )
}
