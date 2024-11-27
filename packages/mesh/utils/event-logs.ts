import type { ShareData, UserPayload } from '@/types/user-behavior-log'
import { generateUserBehaviorLogInfo } from '@/utils/generate-user-behavior-log-info'
import { sendUserBehaviorLog } from '@/utils/send-user-behavior-log'

export function logStoryClick(
  userPayload: UserPayload,
  storyId: string,
  storyTitle: string,
  isRelatedStory = false
) {
  const basicInfo = generateUserBehaviorLogInfo('click', userPayload)

  if (basicInfo) {
    const interaction = isRelatedStory
      ? {
          relatedStories: {
            relatedStoryId: storyId,
            relatedTitle: storyTitle,
          },
        }
      : {
          story: {
            storyId,
            storyTitle,
          },
        }

    const info = {
      ...basicInfo,
      interaction,
    }

    sendUserBehaviorLog(info)
  }
}

export function logShareClick(
  userPayload: UserPayload,
  interactionData: ShareData
) {
  const basicInfo = generateUserBehaviorLogInfo('click', userPayload)

  if (basicInfo) {
    const interaction = {
      ...interactionData,
    }

    const info = {
      ...basicInfo,
      interaction,
    }

    sendUserBehaviorLog(info)
  }
}

export function logCategoryClick(
  userPayload: UserPayload,
  categoryName: string
) {
  const basicInfo = generateUserBehaviorLogInfo('click', userPayload)

  if (basicInfo) {
    const interaction = {
      categories: {
        categoryName: categoryName,
      },
    }

    const info = {
      ...basicInfo,
      interaction,
    }

    sendUserBehaviorLog(info)
  }
}

export function logPickClick(userPayload: UserPayload, storyId: string) {
  const basicInfo = generateUserBehaviorLogInfo('click', userPayload)

  if (basicInfo) {
    const interaction = {
      pick: {
        storyId,
      },
    }

    const info = {
      ...basicInfo,
      interaction,
    }

    sendUserBehaviorLog(info)
  }
}

export function logBookmarkClick(userPayload: UserPayload, storyId: string) {
  const basicInfo = generateUserBehaviorLogInfo('click', userPayload)

  if (basicInfo) {
    const interaction = {
      bookmark: {
        storyId,
      },
    }

    const info = {
      ...basicInfo,
      interaction,
    }

    sendUserBehaviorLog(info)
  }
}

export function logCollectionClick(userPayload: UserPayload, storyId: string) {
  const basicInfo = generateUserBehaviorLogInfo('click', userPayload)

  if (basicInfo) {
    const interaction = {
      collection: {
        storyId,
      },
    }

    const info = {
      ...basicInfo,
      interaction,
    }

    sendUserBehaviorLog(info)
  }
}

export function logStoryActionClick(
  userPayload: UserPayload,
  actionType: {
    isPick: boolean
    isComment: boolean
    isPickAndComment: boolean
  },
  actionOwnerIds: string[]
) {
  const basicInfo = generateUserBehaviorLogInfo('click', userPayload)
  if (basicInfo) {
    let type = ''

    if (actionType.isPickAndComment) {
      type = 'pick-comment'
    } else if (actionType.isPick) {
      type = 'pick'
    } else if (actionType.isComment) {
      type = 'comment'
    }

    const userActivity = {
      activityType: type,
      userId: actionOwnerIds,
    }

    const info = {
      ...basicInfo,
      userActivity,
    }

    sendUserBehaviorLog(info)
  }
}

export function logVideoPlay(userPayload: UserPayload) {
  const basicInfo = generateUserBehaviorLogInfo('click', userPayload)

  if (basicInfo) {
    const interaction = {
      media: {
        videoPlay: true,
      },
    }

    const info = {
      ...basicInfo,
      interaction,
    }

    sendUserBehaviorLog(info)
  }
}
