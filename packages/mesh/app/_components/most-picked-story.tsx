import { fetchMostPickedStory } from '@/app/actions/get-homepage'

import FeaturedCard from './featured-card'

export default async function MostPickedStory() {
  const story = await fetchMostPickedStory()
  if (!story) return null

  return (
    <FeaturedCard
      story={story}
      customId={story.source.customId}
      publisher={story.source.title}
      publisherId={story.source.id}
      gtmTags={{
        story: 'GTM-homepage_click_popular_article',
        pick: 'GTM-homepage_pick_popular_article',
      }}
    />
  )
}
