'use client'

import { useRouter } from 'next/navigation'
import type { ForwardedRef, MouseEventHandler, RefObject } from 'react'
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { twMerge } from 'tailwind-merge'

import { addBookmark, removeBookmark } from '@/app/actions/bookmark'
import { removeFollowPublisher } from '@/app/actions/follow-publisher'
import TOAST_MESSAGE from '@/constants/toast'
import { useToast } from '@/context/toast'
import { useUser } from '@/context/user'
import useClickOutside from '@/hooks/use-click-outside'
import { PaymentType } from '@/types/payment'
import { getStoryUrl } from '@/utils/get-url'
import { getTailwindConfigBreakpointNumber } from '@/utils/tailwind'

import Icon from './icon'
import ShareSheet from './share-sheet'

type Position = {
  top: number
  left: number
}

const isPositionValid = (position: Position) => {
  return Number.isFinite(position.top) && Number.isFinite(position.left)
}

export default function StoryMoreActionButton({
  storyId,
  publisherId,
  canUnFollowPublisher = false,
  nestedScrollContainerRef,
  className,
}: {
  storyId: string
  publisherId: string
  canUnFollowPublisher?: boolean
  nestedScrollContainerRef?: RefObject<HTMLElement>
  className?: string
}) {
  const [shouldShowShareSheet, setShouldShowShareSheet] = useState(false)
  const [shouldShowActionSheet, setShouldShowActionSheet] = useState(false)
  const [position, setPosition] = useState<Position>({
    top: Infinity,
    left: Infinity,
  })
  const actionSheetRef = useRef<HTMLDivElement>(null)

  useClickOutside(actionSheetRef, () => {
    closeActionSheet()
  })

  const openActionSheet: MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.preventDefault()
    if (window.innerWidth >= getTailwindConfigBreakpointNumber('sm')) {
      const button = evt.target as HTMLButtonElement
      const { top, left } = button.getBoundingClientRect()
      setPosition({ top, left })
    } else {
      setPosition({ top: Infinity, left: Infinity })
    }
    setShouldShowActionSheet(true)
  }

  const closeActionSheet = useCallback(() => {
    setShouldShowActionSheet(false)
  }, [])

  const openShareSheet = () => {
    setShouldShowActionSheet(false)
    setShouldShowShareSheet(true)
  }

  const closeShareSheet = () => {
    setShouldShowShareSheet(false)
  }

  useEffect(() => {
    const onScroll = () => {
      closeActionSheet()
    }
    const nestedScrollContainer = nestedScrollContainerRef?.current

    /**
     * Hide the action sheet when scroll, for scroll event on both window and nested scroll container (if exists).
     * Avoid complicated logic to set dynamic position.
     */
    if (nestedScrollContainer) {
      nestedScrollContainer.addEventListener('scroll', onScroll)
    }
    window.addEventListener('scroll', onScroll)

    return () => {
      if (nestedScrollContainer) {
        nestedScrollContainer.removeEventListener('scroll', onScroll)
      }
      window.removeEventListener('scroll', onScroll)
    }
  }, [closeActionSheet, nestedScrollContainerRef])

  return (
    <div className="relative">
      <button
        onClick={openActionSheet}
        className={twMerge('group flex items-center justify-center', className)}
      >
        <Icon
          iconName="icon-more-horiz"
          size="l"
          className="group-hover:hidden"
        />
        <Icon
          iconName="icon-more-horiz-hover"
          size="l"
          className="hidden group-hover:block"
        />
      </button>
      {shouldShowActionSheet && (
        <ActionSheet
          ref={actionSheetRef}
          storyId={storyId}
          publisherId={publisherId}
          onClose={closeActionSheet}
          openShareSheet={openShareSheet}
          canUnFollowPublisher={canUnFollowPublisher}
          position={position}
        />
      )}
      {shouldShowShareSheet && (
        <ShareSheet onClose={closeShareSheet} url={getStoryUrl(storyId)} />
      )}
    </div>
  )
}

enum ActionType {
  Sponsor = 'sponsor',
  AddBookMark = 'add-bookmark',
  UnFollow = 'unfollow',
  CopyLink = 'copy-link',
  Share = 'Share',
}

const actions = [
  { type: ActionType.Sponsor, text: '贊助', icon: 'icon-wallet' },
  {
    type: ActionType.AddBookMark,
    text: '加入書籤',
    icon: 'icon-bookmark',
    offText: '移除書籤',
    offIcon: 'icon-bookmark-off',
  },
  {
    type: ActionType.UnFollow,
    text: '取消追蹤',
    icon: 'icon-unfollow',
  },
  { type: ActionType.CopyLink, text: '複製連結', icon: 'icon-copy' },
  { type: ActionType.Share, text: '分享', icon: 'icon-share' },
] as const

const ActionSheet = forwardRef(function ActionSheet(
  {
    storyId,
    publisherId,
    openShareSheet,
    canUnFollowPublisher,
    position,
    onClose,
  }: {
    storyId: string
    publisherId: string
    openShareSheet: () => void
    canUnFollowPublisher: boolean
    position: Position
    onClose: () => void
  },
  ref: ForwardedRef<HTMLDivElement>
) {
  const router = useRouter()
  const { user, setUser } = useUser()

  const isStoryAddedBookmark = user.bookmarkStoryIds.has(storyId)
  const hasPosition = isPositionValid(position)
  const { addToast } = useToast()

  const onAction = async (type: ActionType) => {
    if (!storyId) {
      addToast({ status: 'fail', text: TOAST_MESSAGE.moreActionError })
      console.error(
        `more action on story error, storyId: ${storyId}, publisherId: ${publisherId}`
      )
      return
    }
    switch (type) {
      case ActionType.Sponsor: {
        if (!publisherId) {
          addToast({ status: 'fail', text: TOAST_MESSAGE.moreActionError })
          console.error(
            `more action on story error, storyId: ${storyId}, publisherId: ${publisherId}`
          )
          return
        }
        router.push(`/payment/${PaymentType.Sponsor}/${publisherId}`)
        break
      }
      case ActionType.AddBookMark: {
        if (!user.memberId) {
          router.push('/login')
          return
        }
        if (isStoryAddedBookmark) {
          const removeBookmarkResponse = await removeBookmark({
            memberId: user.memberId,
            storyId,
          })
          if (removeBookmarkResponse) {
            setUser((oldUser) => ({
              ...oldUser,
              bookmarkStoryIds: new Set(
                [...oldUser.bookmarkStoryIds].filter(
                  (bookmarkStoryId) => bookmarkStoryId !== storyId
                )
              ),
            }))
          } else {
            addToast({
              status: 'fail',
              text: TOAST_MESSAGE.deleteBookmarkFailed,
            })
          }
          onClose()
        } else {
          const addBookmarkResponse = await addBookmark({
            memberId: user.memberId,
            storyId,
          })
          if (addBookmarkResponse) {
            setUser((oldUser) => ({
              ...oldUser,
              bookmarkStoryIds: new Set([...oldUser.bookmarkStoryIds, storyId]),
            }))
          } else {
            addToast({
              status: 'fail',
              text: TOAST_MESSAGE.addBookmarkFailed,
            })
          }
          onClose()
        }
        break
      }
      case ActionType.UnFollow: {
        const removeResponse = await removeFollowPublisher({
          memberId: user.memberId,
          publisherId: publisherId,
        })
        if (removeResponse) {
          setUser((oldUser) => ({
            ...oldUser,
            followingPublishers: oldUser.followingPublishers.filter(
              (followingPublisher) => followingPublisher.id !== publisherId
            ),
          }))
        }
        onClose()
        break
      }
      case ActionType.CopyLink: {
        const storyUrl = getStoryUrl(storyId)
        navigator.clipboard
          .writeText(storyUrl)
          .then(() => {
            addToast({
              status: 'success',
              text: TOAST_MESSAGE.copyStoryLinkSuccess,
            })
            onClose()
          })
          .catch((error) => {
            console.error(`Copy story url: ${storyUrl} failed`, error)
          })
        break
      }
      case ActionType.Share:
        openShareSheet()
        break
      default:
        break
    }
  }

  const alternativeClasses = hasPosition
    ? 'sm:fixed sm:right-[unset] sm:top-[unset]'
    : ''

  return createPortal(
    <div
      ref={ref}
      className={twMerge(
        'fixed bottom-0 left-0 z-modal flex w-full flex-col bg-white py-2 shadow-[0px_0px_8px_0px_rgba(0,0,0,0.1),0px_-8px_20px_0px_rgba(0,0,0,0.1)] sm:absolute sm:bottom-[unset] sm:left-[unset] sm:top-0 sm:w-[unset] sm:min-w-[180px] sm:rounded-md sm:px-0 sm:shadow-light-box',
        alternativeClasses
      )}
      style={
        hasPosition
          ? {
              top: position.top,
              left: position.left - 180 + 20,
            }
          : undefined
      }
      onClick={(evt) => {
        evt.stopPropagation()
      }}
    >
      {actions.map((action) => {
        switch (action.type) {
          case ActionType.AddBookMark: {
            return (
              <button
                key={action.type}
                className="flex w-full cursor-pointer gap-1 px-5 py-3 hover:bg-primary-100 sm:w-auto sm:min-w-max sm:py-[9px]"
                onClick={onAction.bind(null, action.type)}
              >
                <Icon
                  iconName={isStoryAddedBookmark ? action.offIcon : action.icon}
                  size="l"
                />
                <span className="button-large shrink-0 text-primary-700">
                  {isStoryAddedBookmark ? action.offText : action.text}
                </span>
              </button>
            )
          }
          case ActionType.UnFollow: {
            return canUnFollowPublisher ? (
              <button
                key={action.type}
                className="flex w-full cursor-pointer gap-1 px-5 py-3 hover:bg-primary-100 sm:w-auto sm:min-w-max sm:py-[9px]"
                onClick={onAction.bind(null, action.type)}
              >
                <Icon iconName={action.icon} size="l" />
                <span className="button-large shrink-0 text-primary-700">
                  {action.text}
                </span>
              </button>
            ) : null
          }
          default: {
            return (
              <button
                key={action.type}
                className="flex w-full cursor-pointer gap-1 px-5 py-3 hover:bg-primary-100 sm:w-auto sm:min-w-max sm:py-[9px]"
                onClick={onAction.bind(null, action.type)}
              >
                <Icon iconName={action.icon} size="l" />
                <span className="button-large shrink-0 text-primary-700">
                  {action.text}
                </span>
              </button>
            )
          }
        }
      })}
    </div>,
    document.body
  )
})
