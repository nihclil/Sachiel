'use client'

import Link from 'next/link'

import Button from '@/components/button'
import Avatar from '@/components/story-card/avatar'
import { useFollow } from '@/hooks/use-follow'
import useFollowPublisher from '@/hooks/use-publisher-follow'

type FollowListItemProps = {
  followerId: string
  followerAvatar: string
  followerName: string
  followerCustomId: string
  type: 'member' | 'publisher'
  isMutualFans?: boolean
}

const FollowListItem = ({
  followerId,
  followerAvatar,
  followerName,
  followerCustomId,
  type,
}: FollowListItemProps) => {
  const {
    handleClickFollow: handleClickFollowMember,
    isFollowing: isMemberFollowing,
  } = useFollow(followerId)
  const {
    handleFollowOnClick: handleClickFollowPublisher,
    isFollowing: isPublisherFollowing,
  } = useFollowPublisher({
    publisherId: followerId,
    publisherName: followerName,
  })
  const handleFollowOnClick =
    type === 'member' ? handleClickFollowMember : handleClickFollowPublisher
  const isFollowing =
    type === 'member' ? isMemberFollowing : isPublisherFollowing
  return (
    <li
      key={followerId}
      className="flex items-center justify-between border border-red-200 pb-5 pt-[12.5px] first-of-type:pt-[24.5px] lg:px-5"
    >
      <Link
        href={`/profile/${type}/${followerCustomId}`}
        className="flex w-full grow items-center"
      >
        <Avatar src={followerAvatar} size="l" extra="mr-2 shrink-0" />
        <div className="mr-2 flex min-w-0 grow flex-col">
          <p className="subtitle-1 truncate">{followerName}</p>
          <p className="body-3 truncate text-primary-500">{followerCustomId}</p>
        </div>
      </Link>
      <div className="shrink-0">
        <Button
          color="white"
          onClick={handleFollowOnClick}
          size="sm"
          text="追蹤"
          activeState={{
            isActive: isFollowing,
            activeText: '追蹤中',
          }}
        />
      </div>
    </li>
  )
}

export default FollowListItem
