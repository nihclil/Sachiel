import NextLink from 'next/link'

import ImageWithFallback from '@/app/_components/image-with-fallback'
import CollectionPickButton from '@/components/collection-card/collection-pick-button'
import Icon from '@/components/icon'
import { ImageCategory } from '@/constants/fallback-src'
import useWindowDimensions from '@/hooks/use-window-dimension'
import { type SearchResults } from '@/utils/data-schema'

export default function CollectionCard({
  collection,
}: {
  collection: NonNullable<SearchResults['collection']>[number]
}) {
  const { id, title, creator, heroImage, readsCount } = collection
  const { width } = useWindowDimensions()
  const buttonSize = width >= 1440 ? 'md' : 'sm'

  return (
    <div className="flex w-[150px] shrink-0 flex-col rounded border xl:w-[192px]">
      <NextLink href={`/collection/${id}`}>
        <div className="relative aspect-[2]">
          <ImageWithFallback
            alt={`${title}'s cover image`}
            fallbackCategory={ImageCategory.STORY}
            src={heroImage.resized.original}
            className="rounded-t object-cover"
            fill
          />
          <div className="absolute right-[6px] top-2 flex items-center rounded-md bg-black/50 px-[6px] py-[2.5px]">
            <Icon iconName="icon-collection-folder" size="s" />
            <span className="caption-2 text-white">集錦</span>
          </div>
        </div>
      </NextLink>
      <div className="flex flex-col px-3 py-2">
        <NextLink href={`/collection/${id}`}>
          <p className="caption-1 text-primary-500">@{creator.customId}</p>
          <p className="subtitle-2 xl:subtitle-1 line-clamp-2 h-9 text-primary-700 xl:h-12">
            {title}
          </p>
          <p className="footnote pb-2 pt-3 text-primary-600">
            <span className="font-medium text-primary-700">{readsCount}</span>
            精選
          </p>
        </NextLink>
        <CollectionPickButton collectionId={id} size={buttonSize} />
      </div>
    </div>
  )
}
