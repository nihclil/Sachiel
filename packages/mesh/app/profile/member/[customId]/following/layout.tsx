'use client'
import { useRouter } from 'next/navigation'

import Icon from '@/components/icon'

const FollowingLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const router = useRouter()
  const backToPreviousPage = () => {
    router.back()
  }
  return (
    <div className="flex grow flex-col bg-multi-layer-light">
      <header className="absolute left-0 right-0 top-0 z-header flex h-[60px] border-b bg-white sm:hidden">
        <div className="grid grow grid-cols-3 items-center">
          <button
            type="button"
            className="ml-2 p-3"
            onClick={backToPreviousPage}
          >
            <Icon
              iconName="icon-chevron-left"
              size={{ width: 20, height: 20 }}
            />
          </button>
          <p className="list-title place-self-center">追蹤中</p>
        </div>
      </header>
      {children}
    </div>
  )
}

export default FollowingLayout
