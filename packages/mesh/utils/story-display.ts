import { DAY, HOUR, MINUTE } from '@/constants/time-unit'
import { type UserActionStoryFragment } from '@/graphql/__generated__/graphql'

export const displayTimeFromNow = (date: string | Date) => {
  const differenceInMilliseconds = Date.now() - new Date(date).getTime()
  const differenceInMinutes = differenceInMilliseconds / MINUTE
  const differenceInHours = differenceInMilliseconds / HOUR
  const differenceInDays = differenceInMilliseconds / DAY

  const fullDisplayTime = (date: string | Date) => {
    const targetDate = new Date(date)
    const currentYear = new Date().getFullYear()
    const year = targetDate.getFullYear()
    const month = String(targetDate.getMonth() + 1).padStart(2, '0')
    const day = String(targetDate.getDate()).padStart(2, '0')

    if (year === currentYear) {
      return `${month}/${day}`
    } else {
      return `${year}/${month}/${day}`
    }
  }

  if (differenceInMilliseconds < 0) {
    return fullDisplayTime(date)
  } else if (differenceInMilliseconds < HOUR) {
    return Math.floor(differenceInMinutes) + ' 分鐘前'
  } else if (differenceInMilliseconds < 24 * HOUR) {
    return Math.floor(differenceInHours) + ' 小時前'
  } else if (differenceInMilliseconds < 7 * DAY) {
    return Math.floor(differenceInDays) + ' 天前'
  } else {
    return fullDisplayTime(date)
  }
}

export const displayExpireTimeFromNow = (date: string) => {
  const differenceInMilliseconds = new Date(date).getTime() - Date.now()
  const differenceInDays = differenceInMilliseconds / DAY
  const daysToExpire = Math.max(1, Math.ceil(differenceInDays))
  const chineseNumbers = ['', '一', '二', '三']
  const dayInChinese =
    chineseNumbers[daysToExpire] ?? chineseNumbers[chineseNumbers.length - 1]

  return `${dayInChinese}天`
}

type Picks = UserActionStoryFragment['pick']

export const getDisplayPicks = (
  picks: Picks,
  followingMemberIds: Set<string>
) => {
  const picksFromFollowingMember: Picks = []
  const picksFromStranger: Picks = []

  picks?.forEach((pick) =>
    followingMemberIds.has(pick.member?.id ?? '')
      ? picksFromFollowingMember.push(pick)
      : picksFromStranger.push(pick)
  )

  const displayPicks = [
    ...picksFromFollowingMember,
    ...picksFromStranger,
  ].slice(0, 4)

  return displayPicks
}

export const displayTime = (date: string | Date) => {
  if (!date) return
  const targetDate = new Date(date)
  const year = targetDate.getFullYear()
  const month = String(targetDate.getMonth() + 1).padStart(2, '0')
  const day = String(targetDate.getDate()).padStart(2, '0')
  const hour = String(targetDate.getHours()).padStart(2, '0')
  const second = String(targetDate.getMinutes()).padStart(2, '0')

  return `${year}/${month}/${day} ${hour}:${second}`
}

export const displayDateWithWeekday = () => {
  const today = new Date()
  const month = String(today.getMonth() + 1)
  const date = String(today.getDate())
  const day = today.getDay()
  const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六']
  const dayInChinese = daysOfWeek[day]

  const currentTime = `${month}月${date}日(${dayInChinese})`

  return currentTime
}
