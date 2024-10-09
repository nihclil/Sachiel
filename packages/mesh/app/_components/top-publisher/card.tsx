import NextImage from 'next/image'
import NextLink from 'next/link'

import PublisherDonateButton from '@/components/publisher-card/donate-button'
import StoryMeta from '@/components/story-card/story-meta'
import type { SponsoredStory } from '@/types/homepage'

const StoryCard = ({
  showImage,
  story,
}: {
  showImage: boolean
  story: SponsoredStory['stories'][number]
}) => {
  return (
    <article className="border-b-[0.5px] border-primary-200 py-3 last:border-b-0">
      <NextLink href={`/story/${story.id}`}>
        {showImage && story.og_image && (
          <div className="relative mb-3 aspect-[2/1] overflow-hidden rounded">
            <NextImage
              alt={story.title}
              src={story.og_image}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div>
          <h3 className="subtitle-2 mb-1 text-primary-700">{story.title}</h3>
          <div className="caption-1">
            <StoryMeta
              commentCount={story.commentCount}
              publishDate={story.published_date}
              paywall={story.paywall}
              fullScreenAd={story.full_screen_ad}
            />
          </div>
        </div>
      </NextLink>
    </article>
  )
}

type Props = {
  publisher: SponsoredStory
}

export default function TopPublisherCard({ publisher }: Props) {
  return (
    <div className="flex flex-col rounded-lg border-[0.5px] border-primary-200 bg-primary-100 px-5 pb-2 pt-5 lg:self-start lg:px-8 lg:pb-3 lg:pt-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex gap-x-3">
          {/* TODO: render logo of publisher */}
          <div>LOGO</div>
          <div>
            <p className="subtitle-2 text-primary-700">
              <NextLink href={`profile/publisher/${publisher.customId}`}>
                {publisher.title}
              </NextLink>
            </p>
            <p className="footnote text-primary-500">
              已獲得
              <span className="text-custom-blue">
                {publisher.sponsoredCount}次
              </span>
              贊助
            </p>
          </div>
        </div>
        <PublisherDonateButton publisherId={publisher.id} />
      </div>
      {publisher.stories.map((story, index) => (
        <StoryCard showImage={index === 0} story={story} key={story.id} />
      ))}
    </div>
  )
}
