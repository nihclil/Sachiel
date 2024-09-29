'use client'
import '@/styles/global.css'

import { useParams, usePathname, useRouter } from 'next/navigation'

import LayoutTemplate from '@/components/layout-template'
import GoBackButton from '@/components/navigation/go-back-button'
import MoreButton from '@/components/story-card/more-button'
import { FOLLOW_LIST_PATHS } from '@/constants/page-style'
import { EditProfileProvider } from '@/context/edit-profile'
import { useUser } from '@/context/user'

const hasNestedLayout = (pathName: string) => {
  return FOLLOW_LIST_PATHS.some((path) => pathName.endsWith(path))
}

export default function ProfileMemberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathName = usePathname()
  const router = useRouter()
  const params = useParams<{ customId?: string }>()
  const { user } = useUser()

  const pageCustomId = params.customId ?? ''
  const isSelf = pageCustomId === user?.customId

  const handleMoreButtonClicked = () => {
    // TODO: deal with the feature
  }

  const goToSettingPage = () => {
    // TODO: update the setting url
  }

  const backToPreviousPage = () => {
    router.back()
  }

  if (hasNestedLayout(pathName)) {
    return <EditProfileProvider>{children}</EditProfileProvider>
  }

  return (
    <LayoutTemplate
      type="default"
      customStyle={{
        background: 'bg-white',
        restrictMainWidth: false,
        footer: 'hidden sm:block',
      }}
      mobileNavigation={{
        leftButtons: [
          isSelf
            ? { type: 'icon', icon: 'icon-setting', onClick: goToSettingPage }
            : {
                type: 'icon',
                icon: 'icon-chevron-left',
                onClick: backToPreviousPage,
              },
        ],
        title: pageCustomId,
        rightButtons: [
          {
            type: 'icon',
            icon: 'icon-more-horiz',
            onClick: handleMoreButtonClicked,
          },
        ],
      }}
      nonMobileNavigation={{
        leftButtons: isSelf ? [] : [<GoBackButton key={0} />],
        title: pageCustomId,
        rightButtons: [<MoreButton key={0} />],
      }}
    >
      <EditProfileProvider>{children}</EditProfileProvider>
    </LayoutTemplate>
  )
}
