import type { MouseEventHandler } from 'react'

import { getShareUrl } from '@/utils/get-url'

import Icon from './icon'

const shareMedia = [
  {
    id: 'facebook',
    icon: 'icon-share-facebook',
    text: 'Facebook',
    urlTemplate: 'https://www.facebook.com/share.php?u=${url}',
  },
  {
    id: 'line',
    icon: 'icon-share-line',
    text: 'LINE',
    urlTemplate: 'https://social-plugins.line.me/lineit/share?url=${url}',
  },
  {
    id: 'threads',
    icon: 'icon-share-threads',
    text: 'Threads',
    urlTemplate: 'https://www.threads.net/intent/post?text=${url}',
  },
  {
    id: 'x',
    icon: 'icon-share-x',
    text: 'x',
    urlTemplate: 'https://twitter.com/intent/tweet?url=${url}',
  },
] as const

export default function ShareSheet({
  url,
  onClose,
}: {
  url: string
  onClose: () => void
}) {
  const onBackgroundClicked = () => {
    onClose()
  }

  const onShareSheetContainerClicked: MouseEventHandler<HTMLDivElement> = (
    evt
  ) => {
    evt.stopPropagation()
  }

  return (
    <div
      className="fixed inset-0 z-modal flex  items-center justify-center  bg-lightbox-light"
      onClick={onBackgroundClicked}
    >
      <div
        className="w-[335px] rounded-xl bg-white shadow-light-box sm:w-[480px]"
        onClick={onShareSheetContainerClicked}
      >
        <div className="flex h-15 items-center justify-between border-b border-[rgba(0,9,40,0.1)] px-2">
          <div />
          <div className="list-title text-primary-800">分享</div>
          <button
            className="flex size-11 items-center justify-center"
            onClick={onClose}
          >
            <Icon iconName="icon-close" size="l" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-y-10 p-5 sm:flex sm:gap-0">
          {shareMedia.map((media) => (
            <a
              key={media.id}
              href={getShareUrl(media.urlTemplate, url)}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <div className="flex flex-col items-center gap-2 sm:flex-1">
                <Icon iconName={media.icon} size={{ width: 40, height: 40 }} />
                <span className="subtitle-2 text-primary-500">
                  {media.text}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}