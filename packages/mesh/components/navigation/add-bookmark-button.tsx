'use client'

import { useRouter } from 'next/navigation'

import { addBookmark, removeBookmark } from '@/app/actions/bookmark'
import TOAST_MESSAGE from '@/constants/toast'
import { useToast } from '@/context/toast'
import { useUser } from '@/context/user'
import { BookmarkObjective } from '@/types/objective'

import Icon from '../icon'

export default function AddBookMarkButton({
  bookmarkObjective,
  targetId,
}: {
  bookmarkObjective: BookmarkObjective
  targetId: string
}) {
  const router = useRouter()
  const { addToast } = useToast()
  const { user, setUser } = useUser()
  const userBookmarkSetKey =
    bookmarkObjective === BookmarkObjective.Story
      ? 'bookmarkStoryIds'
      : ('bookmarkCollectionIds' as const)
  const isAddedBookmark = user[userBookmarkSetKey].has(targetId)

  const onToggleBookmark = async () => {
    if (!user.memberId) {
      router.push('/login')
      return
    }
    if (isAddedBookmark) {
      const removeBookmarkResponse = await removeBookmark({
        memberId: user.memberId,
        // TODO: for now bookmark pub/sub only support storyId, update the param when pub/sub update
        storyId: targetId,
      })
      if (removeBookmarkResponse) {
        setUser((oldUser) => ({
          ...oldUser,
          [userBookmarkSetKey]: new Set(
            [...oldUser[userBookmarkSetKey]].filter(
              (bookmarkObjectId) => bookmarkObjectId !== targetId
            )
          ),
        }))
      } else {
        addToast({ status: 'fail', text: TOAST_MESSAGE.deleteBookmarkFailed })
      }
    } else {
      const addBookmarkResponse = await addBookmark({
        memberId: user.memberId,
        // TODO: for now bookmark pub/sub only support storyId, update the param when pub/sub update
        storyId: targetId,
      })
      if (addBookmarkResponse) {
        setUser((oldUser) => ({
          ...oldUser,
          [userBookmarkSetKey]: new Set([
            ...oldUser[userBookmarkSetKey],
            targetId,
          ]),
        }))
      } else {
        addToast({
          status: 'fail',
          text: TOAST_MESSAGE.addBookmarkFailed,
        })
      }
    }
  }
  return (
    <button
      type="button"
      className="flex size-11 items-center justify-center sm:size-6"
      onClick={onToggleBookmark}
    >
      <Icon
        iconName={isAddedBookmark ? 'icon-bookmark-off' : 'icon-bookmark'}
        size="l"
      />
    </button>
  )
}
