'use client'

import { useCallback, useEffect, useState } from 'react'

import { getMemberPickAndBookmark } from '@/app/actions/edit-collection'
import Spinner from '@/components/spinner'
import { useEditCollection } from '@/context/edit-collection'
import { useUser } from '@/context/user'

import { picksAndBookmarksPageCount } from '../../../_const/edit-collection'
import type { CollectionPickStory } from '../../../_types/edit-collection'
import InfiniteCollectionPicks from '../../infinite-collection-picks'
import PickStoryCard from '../../pick-story-card'
import TabletGoNextButton from '../../tablet/tablet-go-next-button'

export default function MobileStep1SelectStories({
  fixedStory,
}: {
  fixedStory: CollectionPickStory | null
}) {
  return (
    <>
      <div className="mb-[72px] flex grow flex-col pl-2 pr-5 sm:px-5 md:px-[70px] lg:pl-10 lg:pr-0">
        {!fixedStory ? (
          <Step1PickStories />
        ) : (
          <Step1FixedStory fixedStory={fixedStory} />
        )}
      </div>
      <div className="fixed inset-x-0 bottom-0 hidden items-center justify-center bg-white py-4 sm:flex lg:hidden">
        <div className="w-[335px]">
          <TabletGoNextButton />
        </div>
      </div>
    </>
  )
}

const Step1PickStories = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [shouldLoadMore, setShouldLoadMore] = useState(true)

  const { candidates, setCandidates } = useEditCollection()
  const { user } = useUser()

  const loadMorePicksAndBookmarks = useCallback(async () => {
    const response = await getMemberPickAndBookmark({
      memberId: user.memberId,
      pickSkip: candidates.length,
      pickTake: picksAndBookmarksPageCount,
    })
    if (!response) return
    const picksAndBookmarks = response?.member?.picksAndBookmarks ?? []
    const picksAndBookmarksCount = response?.member?.picksAndBookmarksCount ?? 0
    const newCandidates = candidates.concat(picksAndBookmarks)
    setCandidates(newCandidates)

    if (newCandidates.length === picksAndBookmarksCount) {
      setShouldLoadMore(false)
    }
  }, [candidates, setCandidates, user.memberId])

  useEffect(() => {
    const fetchPicksAndBookmarks = async () => {
      setIsLoading(true)
      await loadMorePicksAndBookmarks()
      setIsLoading(false)
    }
    if (!mounted) {
      fetchPicksAndBookmarks()
    }
    setMounted(true)
  }, [loadMorePicksAndBookmarks, mounted])

  return isLoading ? (
    <Spinner />
  ) : (
    <InfiniteCollectionPicks
      key={candidates.length}
      candidates={candidates}
      loadMore={loadMorePicksAndBookmarks}
      shouldLoadMore={shouldLoadMore}
    />
  )
}

const Step1FixedStory = ({
  fixedStory,
}: {
  fixedStory: CollectionPickStory | null
}) => {
  if (!fixedStory) return null
  return (
    <PickStoryCard
      key={fixedStory.id}
      isPicked={true}
      onClick={() => {}}
      story={fixedStory}
    />
  )
}
