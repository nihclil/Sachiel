import { useComment } from '@/context/comment'
import useWindowDimensions from '@/hooks/use-window-dimension'
import { getTailwindConfigBreakpointNumber } from '@/utils/tailwind'

export default function StoryCommentCount({
  commentsCount,
}: {
  commentsCount: number
}) {
  const { dispatch } = useComment()
  const { width } = useWindowDimensions()
  const openCommentBlock = () => {
    dispatch({ type: 'TOGGLE_MOBILE_COMMENT_MODAL', payload: { isOpen: true } })
    document.body.classList.add('overflow-hidden')
  }
  const displayCount =
    commentsCount < 10000
      ? commentsCount
      : (Math.floor(commentsCount / 1000) / 10).toFixed(1)

  const contentJsx = (() => {
    if (commentsCount) {
      return (
        <span>
          <span className="pr-1 text-primary-700">{displayCount}</span>
          {commentsCount < 10000 ? '則留言' : '萬則留言'}
        </span>
      )
    } else {
      return <span>尚無人留言</span>
    }
  })()

  return (
    <button
      onClick={openCommentBlock}
      disabled={width > getTailwindConfigBreakpointNumber('sm')}
    >
      {contentJsx}
    </button>
  )
}
