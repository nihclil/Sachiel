import PickStories from '@/app/collection/(mutate)/_components/pick-stories'
import PickStoryCard from '@/app/collection/(mutate)/_components/pick-story-card'
import type { CollectionPickStory } from '@/app/collection/(mutate)/_types/collection'
import { useCreateCollection } from '@/context/create-collection'

import TabletGoNextButton from '../../tablet/go-next-button'

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
  return <PickStories useCollection={useCreateCollection} />
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
