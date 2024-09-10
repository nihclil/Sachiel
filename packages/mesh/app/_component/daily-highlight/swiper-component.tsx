import NextLink from 'next/link'

import StoryMeta from '@/components/story-card/story-meta'
import type { DailyStory } from '@/types/homepage'

type Props = {
  stories: DailyStory[]
}

export default function SwiperComponent({ stories }: Props) {
  return (
    <div className="overflow-hidden">
      <div className="no-scrollbar flex gap-x-2 overflow-x-auto lg:grid lg:grid-cols-3">
        {stories.map((story) => (
          <div
            key={story.id}
            className="w-[280px] flex-none rounded-md border-[0.5px] border-primary-200 bg-primary-100 px-4 py-3 lg:w-full"
          >
            <p className="caption-1 mb-1 text-primary-500">
              <NextLink href={`/profile/member/${story.source.customId}`}>
                {story.source.title}
              </NextLink>
            </p>

            <h3 className="subtitle-2 mb-2 line-clamp-2 text-primary-700">
              <NextLink href={`story/${story.id}`}> {story.title}</NextLink>
            </h3>
            {/* TODO: full screen ad */}
            <div className="caption-1">
              <StoryMeta
                commentCount={story.commentCount}
                publishDate={story.published_date}
                paywall={story.paywall}
                fullScreenAd=""
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}