import {
  type GetMemberProfileQuery,
  type GetPublisherProfileQuery,
} from '@/graphql/__generated__/graphql'

export enum TabKey {
  PICK = '精選',
  FOLLOWER = '粉絲',
  FOLLOWING = '追蹤中',
  SPONSORED = '本月獲得贊助',
}

export type TabItem = {
  tabName: TabKey
  count: number | string | null
  redirectLink?: string
}
export enum TabCategory {
  PICK = 'PICKS',
  BOOKMARKS = 'BOOKMARKS',
  PUBLISH = 'PUBLISH',
}

export type FormData = {
  name: string
  customId: string
  intro: string
  avatar: string
}

export type ProfileTypes = {
  name: string
  avatar: string
  intro: string
  pickCount: number
  followingCount: string
  followerCount: string
  userType: UserType
  picksData: PickList
  bookmarks?: Bookmarks
  memberId: string
  memberCustomId: string
}

export type Member = GetMemberProfileQuery['member']
export type PickList = NonNullable<Member>['picks']
export type Bookmarks = NonNullable<GetMemberProfileQuery['member']>['books']
export type StoryData = NonNullable<GetPublisherProfileQuery['stories']>
export type StoryDataItem = NonNullable<NonNullable<StoryData>[number]>
export type PickListItem = NonNullable<PickList>[number]['story']
export type UserType = 'member' | 'visitor' | 'publisher'
export type CommentList = NonNullable<PickListItem>['comment']
export type CommentType = NonNullable<CommentList>[number]
