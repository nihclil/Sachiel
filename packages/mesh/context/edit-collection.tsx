import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import {
  updateCollectionPicks as sendUpdateCollectionPicks,
  updateCollectionSummary as sendUpdateCollectionSummary,
  updateCollectionTitle as sendUpdateCollectionTitle,
  updateWholeCollection as sendUpdateWholeCollection,
} from '@/app/actions/edit-collection'
import { maxSummaryLength } from '@/app/collection/(mutate)/_components/edit-summary'
import type { Collection } from '@/app/collection/(mutate)/_types/collection'
import {
  type CollectionPickStory,
  type PickOrBookmark,
} from '@/app/collection/(mutate)/_types/collection'
import {
  prepareUpdateCollectionPicks,
  prepareUpdateCollectionTitle,
  prepareUpdateeCollectionSummary,
} from '@/app/collection/(mutate)/_utils/prepare-update-collection'
import {
  DesktopEditCollectionType,
  MobileEditCollectionType,
} from '@/app/collection/(mutate)/(edit)/_types/edit-collection'
import useWindowDimensions from '@/hooks/use-window-dimension'
import { setCrossPageToast } from '@/utils/cross-page-toast'
import { getTailwindConfigBreakpointNumber } from '@/utils/tailwind'

import { useUser } from './user'

type StoryCandidates = {
  list: PickOrBookmark[]
  maxCount: number
  usedAsFilter: boolean
}

export type EditCollectionContextValue = {
  mobileEditType: MobileEditCollectionType
  setMobileEditType: React.Dispatch<
    React.SetStateAction<MobileEditCollectionType>
  >
  desktopEditType: DesktopEditCollectionType
  setDesktopEditType: React.Dispatch<
    React.SetStateAction<DesktopEditCollectionType>
  >
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  summary: string
  setSummary: React.Dispatch<React.SetStateAction<string>>
  heroImage: File | string | null
  setHeroImage: React.Dispatch<React.SetStateAction<File | string | null>>
  pickCandidates: StoryCandidates
  bookmarkCandidates: StoryCandidates
  setPickCandidates: React.Dispatch<React.SetStateAction<StoryCandidates>>
  setBookmarkCandidates: React.Dispatch<React.SetStateAction<StoryCandidates>>
  collectionPickStories: CollectionPickStory[]
  setCollectionPickStories: React.Dispatch<
    React.SetStateAction<CollectionPickStory[]>
  >
  isMobileEditTypeFullfilled: boolean
  isDesktopEditTypeFullfilled: boolean
  mobileTitle: string
  desktopTitle: string
  updateCollectionTitleAndHeroImage: () => void
  updateCollectionSummary: () => void
  updateCollectionPicks: () => void
  updateWholeCollection: () => void
}

const EditCollectionContext = createContext<
  EditCollectionContextValue | undefined
>(undefined)

const initialStoryCandidate: StoryCandidates = {
  list: [],
  maxCount: 0,
  usedAsFilter: true,
}

export default function EditCollectionProvider({
  children,
  initialDesktopEditType,
  initialMobileEditType,
  initialCollection,
}: {
  children: React.ReactNode
  initialDesktopEditType?: DesktopEditCollectionType
  initialMobileEditType?: MobileEditCollectionType
  initialCollection: Collection
}) {
  const [desktopEditType, setDesktopEditType] = useState(
    initialDesktopEditType ?? DesktopEditCollectionType.EditAll
  )
  const [mobileEditType, setMobileEditType] = useState(
    initialMobileEditType ?? MobileEditCollectionType.TypeEditTitle
  )
  const [title, setTitle] = useState(initialCollection.title ?? '')
  const [summary, setSummary] = useState(initialCollection.summary ?? '')
  const [heroImage, setHeroImage] = useState<File | string | null>(
    initialCollection.heroImage?.resized?.original ?? null
  )
  const [pickCandidates, setPickCandidates] = useState<StoryCandidates>(
    initialStoryCandidate
  )
  const [bookmarkCandidates, setBookmarkCandidates] = useState<StoryCandidates>(
    initialStoryCandidate
  )

  const [collectionPickStories, setCollectionPickStories] = useState<
    CollectionPickStory[]
  >(
    initialCollection.collectionpicks?.reduce((acc, curr) => {
      if (curr && curr.story) {
        acc.push(curr.story)
      }
      return acc
    }, [] as CollectionPickStory[]) ?? []
  )

  const router = useRouter()
  const { user } = useUser()
  const { width } = useWindowDimensions()

  const isMobileEditTypeFullfilled = useMemo(() => {
    switch (mobileEditType) {
      case MobileEditCollectionType.TypeEditTitle:
        return Boolean(title) && Boolean(heroImage)
      case MobileEditCollectionType.TypeEditSummary:
        return !summary || summary.length <= maxSummaryLength
      case MobileEditCollectionType.TypeEditStories:
        return Boolean(collectionPickStories.length)
      case MobileEditCollectionType.TypeAddStories:
        return Boolean(collectionPickStories.length)
      default:
        return false
    }
  }, [collectionPickStories.length, heroImage, mobileEditType, summary, title])

  const isDesktopEditTypeFullfilled = useMemo(() => {
    switch (desktopEditType) {
      case DesktopEditCollectionType.EditAll:
        return (
          Boolean(title) &&
          Boolean(heroImage) &&
          (!summary || summary.length <= maxSummaryLength) &&
          Boolean(collectionPickStories.length)
        )
      case DesktopEditCollectionType.TypeAddStories:
        return Boolean(collectionPickStories.length)
      default:
        return false
    }
  }, [collectionPickStories.length, desktopEditType, heroImage, summary, title])

  const mobileTitle = useMemo(() => {
    switch (mobileEditType) {
      case MobileEditCollectionType.TypeEditTitle:
        return '修改標題'
      case MobileEditCollectionType.TypeEditSummary:
        return '修改敘述'
      case MobileEditCollectionType.TypeEditStories:
        return '編輯排序'
      case MobileEditCollectionType.TypeAddStories:
        return '加入新文章'
      default:
        return ''
    }
  }, [mobileEditType])

  const desktopTitle = useMemo(() => {
    switch (desktopEditType) {
      case DesktopEditCollectionType.EditAll:
        return '編輯集錦'
      case DesktopEditCollectionType.TypeAddStories:
        return '加入新文章'
      default:
        return ''
    }
  }, [desktopEditType])

  const updateCollectionTitleAndHeroImage = async () => {
    const collectionId = initialCollection.id
    const { isTitleUpdated, newTitle, isHeroImageUpdated, imageUpload } =
      prepareUpdateCollectionTitle({
        newTitle: title,
        oldTitle: initialCollection.title ?? '',
        heroImage,
      })

    if (isTitleUpdated || isHeroImageUpdated) {
      const response = await sendUpdateCollectionTitle({
        collectionId,
        title: newTitle,
        imageUpload,
      })
      if (!response) {
        setCrossPageToast({ status: 'fail', text: '編輯集錦失敗，請重新嘗試' })
      }
    }
    router.push(`/collection/${collectionId}`)
  }

  const updateCollectionSummary = async () => {
    const collectionId = initialCollection.id
    const { isSummaryUpdated, newSummary } = prepareUpdateeCollectionSummary({
      newSummary: summary,
      oldSummary: initialCollection.summary ?? '',
    })

    if (isSummaryUpdated) {
      const response = await sendUpdateCollectionSummary({
        collectionId,
        summary: newSummary,
      })
      if (!response) {
        setCrossPageToast({ status: 'fail', text: '編輯集錦失敗，請重新嘗試' })
      }
    }
    router.push(`/collection/${collectionId}`)
  }

  const updateCollectionPicks = async () => {
    const collectionId = initialCollection.id

    const {
      isCollectionPicksUpdated,
      createCollectionPicksData,
      updateCollectionPicksData,
      deleteCollectionPicksData,
    } = prepareUpdateCollectionPicks({
      newCollectionPickStories: collectionPickStories,
      oldCollectionPicks: initialCollection.collectionpicks ?? [],
      memberId: user.memberId,
    })

    if (isCollectionPicksUpdated) {
      const response = await sendUpdateCollectionPicks({
        collectionId,
        createCollectionPicksData,
        updateCollectionPicksData,
        deleteCollectionPicksData,
      })
      if (!response) {
        setCrossPageToast({ status: 'fail', text: '編輯集錦失敗，請重新嘗試' })
      }
    }
    router.push(`/collection/${collectionId}`)
  }

  const updateWholeCollection = async () => {
    const collectionId = initialCollection.id
    const { isTitleUpdated, newTitle, isHeroImageUpdated, imageUpload } =
      prepareUpdateCollectionTitle({
        newTitle: title,
        oldTitle: initialCollection.title ?? '',
        heroImage,
      })
    const { isSummaryUpdated, newSummary } = prepareUpdateeCollectionSummary({
      newSummary: summary,
      oldSummary: initialCollection.summary ?? '',
    })
    const {
      isCollectionPicksUpdated,
      createCollectionPicksData,
      updateCollectionPicksData,
      deleteCollectionPicksData,
    } = prepareUpdateCollectionPicks({
      newCollectionPickStories: collectionPickStories,
      oldCollectionPicks: initialCollection.collectionpicks ?? [],
      memberId: user.memberId,
    })

    const isCollectionUpdated =
      isTitleUpdated ||
      isHeroImageUpdated ||
      isSummaryUpdated ||
      isCollectionPicksUpdated

    if (isCollectionUpdated) {
      const response = await sendUpdateWholeCollection({
        collectionId,
        title: newTitle,
        imageUpload,
        summary: newSummary,
        createCollectionPicksData,
        updateCollectionPicksData,
        deleteCollectionPicksData,
      })
      if (!response) {
        setCrossPageToast({ status: 'fail', text: '編輯集錦失敗，請重新嘗試' })
      }
    }
    router.push(`/collection/${collectionId}`)
  }

  // go back to collection page when mobile page render in desktop and vice versa change
  useEffect(() => {
    if (width) {
      const desktopBreakpoint = getTailwindConfigBreakpointNumber('lg')
      const isPageRenderedInWrongDimension =
        (initialDesktopEditType && width < desktopBreakpoint) ||
        (initialMobileEditType && width >= desktopBreakpoint)
      if (isPageRenderedInWrongDimension) {
        router.back()
      }
    }
  }, [initialDesktopEditType, initialMobileEditType, router, width])

  return (
    <EditCollectionContext.Provider
      value={{
        mobileEditType,
        setMobileEditType,
        desktopEditType,
        setDesktopEditType,
        title,
        setTitle,
        summary,
        setSummary,
        heroImage,
        setHeroImage,
        pickCandidates,
        setPickCandidates,
        bookmarkCandidates,
        setBookmarkCandidates,
        collectionPickStories,
        setCollectionPickStories,
        isMobileEditTypeFullfilled,
        isDesktopEditTypeFullfilled,
        mobileTitle,
        desktopTitle,
        updateCollectionTitleAndHeroImage,
        updateCollectionSummary,
        updateCollectionPicks,
        updateWholeCollection,
      }}
    >
      {children}
    </EditCollectionContext.Provider>
  )
}

export const useEditCollection = () => {
  const context = useContext(EditCollectionContext)
  if (!context) {
    throw new Error(
      'useEditCollection must be used within a EditCollectionProvider'
    )
  }
  return context
}
