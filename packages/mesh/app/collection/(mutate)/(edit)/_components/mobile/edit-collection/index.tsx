'use client'

import { useMemo } from 'react'

import { useEditCollection } from '@/context/edit-collection'

import { MobileEditCollectionType } from '../../../_types/edit-collection'
import TabletNavigation from '../../tablet/navigation'
import MobileAddStories from './add-stories'
import MobileEditStories from './edit-stories'
import MobileEditSummary from './edit-summary'
import MobileEditTitle from './edit-title'

export default function MobileEditCollection() {
  const { mobileEditType } = useEditCollection()

  const editTypeJsx = useMemo(() => {
    switch (mobileEditType) {
      case MobileEditCollectionType.TypeEditTitle:
        return <MobileEditTitle />
      case MobileEditCollectionType.TypeEditSummary:
        return <MobileEditSummary />
      case MobileEditCollectionType.TypeEditStories:
        return <MobileEditStories />
      case MobileEditCollectionType.TypeAddStories:
        return <MobileAddStories />
      default:
        return null
    }
  }, [mobileEditType])

  return (
    <div className="flex w-full grow flex-col sm:mx-auto sm:max-w-screen-sm md:max-w-[740px] lg:hidden">
      <TabletNavigation />
      {editTypeJsx}
    </div>
  )
}
