'use client'
import { useEffect, useState } from 'react'

import { likeComment, unlikeComment } from '@/app/actions/comment'
import { fetchCommentLikes } from '@/app/actions/get-homepage'
import Icon from '@/components/icon'
import Avatar from '@/components/story-card/avatar'
import TOAST_MESSAGE from '@/constants/toast'
import { useToast } from '@/context/toast'
import { useUser } from '@/context/user'
import { useCommentClamp } from '@/hooks/use-comment-clamp'
import type { CategoryStory } from '@/types/homepage'
import { debounce } from '@/utils/performance'
import { displayTimeFromNow } from '@/utils/story-display'

type NonEmptyObject<T> = T extends Record<string, never> ? never : T
type Props = {
  comment: NonEmptyObject<Exclude<CategoryStory['comment'], undefined>>
  activeCategoryTitle: string
}

export default function Comment({ comment, activeCategoryTitle }: Props) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const { user } = useUser()
  const { addToast } = useToast()
  const memberId = user.memberId
  const commentId = comment.id
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCommentLikes(commentId)

      if (data) {
        setLikeCount(data.likeCount || 0)
        if (data.like) {
          const userHasLiked = data.like.some(
            (person) => person.id === memberId
          )
          setIsLiked(userHasLiked)
        }
      }
    }

    fetchData()
  }, [activeCategoryTitle, commentId])

  const handleCommentLiked = debounce(async () => {
    if (isLiked) {
      try {
        const response = await unlikeComment({ memberId, commentId })
        if (!response) {
          addToast({ status: 'fail', text: TOAST_MESSAGE.unlikeCommentFailed })
          throw new Error(`Failed to unlike comment, comment id:${commentId}`)
        }
        setLikeCount((prev) => prev - 1)
        setIsLiked(false)
        return
      } catch (error) {
        console.error(error)
      }
    }

    try {
      const response = await likeComment({ memberId, commentId })
      if (!response) {
        addToast({ status: 'fail', text: TOAST_MESSAGE.likeCommentFailed })
        throw new Error(`Failed to like comment, comment id:${commentId}`)
      }
      setLikeCount((prev) => prev + 1)
      setIsLiked(true)
    } catch (error) {
      console.error(error)
    }
  })

  const canToggle = true
  const clampLineCount = 2
  const { needClamp, commentRef, handleToggleClamp } = useCommentClamp(
    clampLineCount,
    canToggle
  )

  return (
    <div className="cursor-pointer rounded-md border-[0.5px] border-primary-200 bg-primary-100 p-3">
      <div className="mb-2 flex justify-between">
        <div className="flex items-center">
          {/* TODO: add profile link */}
          <Avatar
            src={comment.member.avatar}
            size="m"
            ringColor="primary-100"
          />

          <p className="subtitle-2 ml-2 text-primary-700">
            {comment.member.name}
          </p>
          <Icon iconName="icon-dot" size="xxs" />
          <p className="caption-1 text-primary-500">
            {displayTimeFromNow(comment.createdAt)}
          </p>
        </div>

        <div className="flex items-center">
          <p className="caption-1 text-primary-600">{likeCount}</p>
          <button onClick={handleCommentLiked}>
            <Icon iconName={isLiked ? 'icon-liked' : 'icon-heart'} size="l" />
          </button>
        </div>
      </div>

      <div className="relative" onClick={handleToggleClamp}>
        <p className="body-3 line-clamp-2 text-primary-600" ref={commentRef}>
          {comment.content}
          {needClamp && (
            <span className="body-3 absolute bottom-0 right-0 bg-gradient-to-r from-transparent from-0% to-primary-100 to-10% pl-4">
              <span className="text-primary-600">... </span>
              <span className="text-primary-400">顯示更多</span>
            </span>
          )}
        </p>
      </div>
    </div>
  )
}
