'use client'

import CollectionPickButton from '@/components/collection-card/collection-pick-button'
import LayoutTemplate from '@/components/layout-template'
import GoBackButton from '@/components/navigation/go-back-button'
import ShareButton from '@/components/navigation/share-button'
import type { GetCollectionQuery } from '@/graphql/__generated__/graphql'
// import AddBookMarkButton from '@/components/navigation/add-bookmark-button'
import { getCollectionUrl } from '@/utils/get-url'

import CollectionMoreActionButton from './collection-more-action-button'
import Loading from './loading'
// import { BookmarkObjective } from '@/types/objective'

type Collection = NonNullable<GetCollectionQuery['collections']>[number]

export default function ClientLayout({
  collection,
  children,
}: {
  collection: Collection
  children: React.ReactNode
}) {
  return (
    <LayoutTemplate
      type="default"
      customStyle={{
        background: 'bg-multi-layer-light',
        footer: 'hidden sm:block',
        nav: 'hidden sm:block',
      }}
      mobileNavigation={{
        leftButtons: [<GoBackButton key={0} />],
        title: '集錦',
        rightButtons: [
          // TODO: for now bookmark pub/sub only support add story to bookmark, unlock the comment when pub/sub update
          // <AddBookMarkButton
          //   key={0}
          //   bookmarkObjective={BookmarkObjective.Collection}
          //   targetId={collection.id}
          // />,
          <ShareButton key={1} url={getCollectionUrl(collection.id)} />,
          <div className="flex size-11 items-center justify-center" key={0}>
            <CollectionMoreActionButton collection={collection} />
          </div>,
        ],
      }}
      nonMobileNavigation={{
        leftButtons: [<GoBackButton key={0} />],
        title: '集錦',
        rightButtons: [
          <CollectionMoreActionButton key={2} collection={collection} />,
        ],
      }}
      mobileActionBar={{
        picksCount: collection.picksCount ?? 0,
        commentsCount: collection.commentsCount ?? 0,
        actions: [
          <CollectionPickButton key={0} collectionId={collection.id} />,
        ],
      }}
      suspenseFallback={<Loading />}
    >
      {children}
    </LayoutTemplate>
  )
}
