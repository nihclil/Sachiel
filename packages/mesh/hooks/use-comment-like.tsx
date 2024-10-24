import { useState } from 'react'

import { likeComment, unlikeComment } from '@/app/actions/comment'
import TOAST_MESSAGE from '@/constants/toast'
import { useComment } from '@/context/comment-context'
import { useToast } from '@/context/toast'
import { useUser } from '@/context/user'
import type { GetStoryQuery } from '@/graphql/__generated__/graphql'
import { type CommentType } from '@/types/profile'
import { debounce } from '@/utils/performance'

// 從 Story Query 中提取 Comment 型別
type CommentTypeFromStory = NonNullable<
  NonNullable<GetStoryQuery['story']>['comments']
>[0]

// 定義共同的 Member 型別
type MemberType = {
  __typename?: 'Member'
  id: string
}

type UseCommentLikeProps = {
  initialComment: CommentType | CommentTypeFromStory
}

type UseCommentLikeReturn = {
  commentData: CommentType | CommentTypeFromStory
  isCommentLiked: boolean
  handleLikeComment: () => void
}

// Type guard functions
function isCommentType(
  comment: CommentType | CommentTypeFromStory
): comment is CommentType {
  return 'isMemberLiked' in comment
}

function isCommentTypeFromStory(
  comment: CommentType | CommentTypeFromStory
): comment is CommentTypeFromStory {
  return 'like' in comment
}

export const useCommentLike = ({
  initialComment,
}: UseCommentLikeProps): UseCommentLikeReturn => {
  const [commentData, setCommentData] = useState<
    CommentType | CommentTypeFromStory
  >(initialComment)
  const { user } = useUser()
  const { addToast } = useToast()
  const { updateCommentLikeStatus } = useComment()

  const memberLikedList = (): Array<MemberType> | undefined => {
    if (isCommentType(commentData)) {
      return commentData.isMemberLiked || []
    }
    if (isCommentTypeFromStory(commentData)) {
      return commentData.like || []
    }
    return undefined
  }

  const isCommentLiked = !!memberLikedList()?.length

  const handleLikeComment = debounce(async () => {
    const likeCommentArgs = {
      memberId: user.memberId,
      commentId: commentData.id,
    }

    if (isCommentLiked) {
      try {
        const response = await unlikeComment(likeCommentArgs)
        if (!response) {
          addToast({ status: 'fail', text: TOAST_MESSAGE.unlikeCommentFailed })
          throw new Error('Failed to unlike comment')
        }
        setCommentData((prev) => {
          const prevLikeCount = Math.max(0, (prev.likeCount ?? 0) - 1)

          // 根據不同型別更新相應的欄位
          if (isCommentType(prev)) {
            return {
              ...prev,
              likeCount: prevLikeCount > 0 ? prevLikeCount - 1 : 0,
              isMemberLiked: prev.isMemberLiked?.filter(
                (item) => item.id !== user.memberId
              ),
            }
          } else {
            return {
              ...prev,
              likeCount: prevLikeCount > 0 ? prevLikeCount - 1 : 0,
              like: prev.like?.filter((item) => item.id !== user.memberId),
            }
          }
        })
        updateCommentLikeStatus(commentData.id, user.memberId, false)
      } catch (error) {
        console.error({ error })
      }
      return
    }

    try {
      const response = await likeComment(likeCommentArgs)
      if (!response) {
        addToast({ status: 'fail', text: TOAST_MESSAGE.likeCommentFailed })
        throw new Error('Failed to like comment')
      }
      setCommentData((prev) => {
        const newMember: MemberType = {
          __typename: 'Member',
          id: user.memberId,
        }

        // 根據不同型別更新相應的欄位
        if (isCommentType(prev)) {
          return {
            ...prev,
            likeCount: (prev.likeCount ?? 0) + 1,
            isMemberLiked: [...(prev.isMemberLiked ?? []), newMember],
          }
        } else {
          return {
            ...prev,
            likeCount: (prev.likeCount ?? 0) + 1,
            like: [...(prev.like ?? []), newMember],
          }
        }
      })
      updateCommentLikeStatus(commentData.id, user.memberId, true)
    } catch (error) {
      console.error({ error })
    }
  })

  return {
    commentData,
    isCommentLiked,
    handleLikeComment,
  }
}
