import { z } from 'zod'

const memberSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string(),
})

export const sourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  customId: z.string(),
})

const categorySchema = z.object({
  slug: z.string(),
})

export const storySchema = z.object({
  id: z.string(),
  url: z.string(),
  title: z.string(),
  published_date: z.string(),
  summary: z.string(),
  og_title: z.string(),
  og_image: z.string(),
  og_description: z.string(),
  full_content: z.boolean(),
  commentCount: z.number(),
  paywall: z.boolean(),
  full_screen_ad: z.string(),
  isMember: z.boolean(),
  pickCount: z.number(),
  picks: z.array(
    z.object({
      createdAt: z.string().optional(),
      member: memberSchema.nullable(),
    })
  ),
  source: z.object({
    id: z.string(),
    title: z.string(),
    customId: z.string(),
  }),
})

export const rawFeaturedStorySchema = storySchema.extend({
  source: sourceSchema,
})

export const rawReadrStorySchema = sourceSchema.extend({
  stories: z.array(storySchema),
})

export const rawMostSponsoredPublisherStorySchema = z.object({
  ...sourceSchema.shape,
  sponsoredCount: z.number(),
  stories: z.array(storySchema.omit({ picks: true, pickCount: true })),
})

export const rawCommentSchema = z.object({
  id: z.string(),
  member: memberSchema,
  content: z.string(),
  likeCount: z.number(),
  story: z
    .object({
      id: z.string(),
      title: z.string(),
      source: sourceSchema,
      published_date: z.string(),
    })
    .nullable(),
})

export const rawDailyHighlightSchema = storySchema
  .omit({
    summary: true,
  })
  .extend({ source: sourceSchema })
  .extend({ category: categorySchema.optional() })

export const rawTopCollectorSchema = z.object({
  id: z.number(),
  name: z.string(),
  avatar: z.string(),
  email: z.string(),
  nickname: z.string(),
  pickCount: z.number(),
})

export const rawCategoryStorySchema = storySchema
  .extend({
    picksCount: z.number(),
    category: z.object({
      id: z.string(),
      slug: z.string(),
    }),
    source: sourceSchema,
  })
  .omit({ isMember: true, pickCount: true })
// TODO: add paywall
export const rawMostSponsoredPublisherStoryByCategorySchema = z.object({
  publisher: z.object({
    id: z.string(),
    title: z.string(),
    customId: z.string(),
    official_site: z.string(),
    sponsoredCount: z.number(),
  }),
  stories: z.array(
    storySchema.omit({
      summary: true,
      paywall: true,
      isMember: true,
      picks: true,
      pickCount: true,
    })
  ),
})

export const MongoDBResponseSchema = z.object({
  members: z.array(
    z.object({
      id: z.string(),
      followerCount: z.number(),
      name: z.string(),
      nickname: z.string(),
      customId: z.string(),
      avatar: z.string(),
      from: z.object({
        id: z.string(),
        name: z.string(),
        nickname: z.string(),
      }),
    })
  ),
  stories: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      publisher: z.object({
        id: z.string(),
        customId: z.string(),
        title: z.string(),
      }),
      published_date: z.string(),
      og_title: z.string(),
      og_image: z.string(),
      full_screen_ad: z.enum(['none', 'all', 'mobile', 'desktop']),
      isMember: z.boolean(),
      readCount: z.number(),
      commentCount: z.number(),
      following_actions: z.array(
        z.object({
          kind: z.enum(['read', 'comment']),
          member: z.object({
            id: z.string(),
            name: z.string(),
            nickname: z.string(),
            customId: z.string(),
            avatar: z.string(),
          }),
          createdAt: z.string().datetime(),
          content: z.string().optional(),
        })
      ),
    })
  ),
})
export type MongoDBResponse = z.infer<typeof MongoDBResponseSchema>

export const mostFollowersMemberSchema = z.array(
  z.object({
    id: z.number().transform((id) => `${id}`),
    followerCount: z.number(),
    name: z.string(),
    nickname: z.string(),
    customId: z.string(),
    avatar: z.string().url().or(z.literal('')),
  })
)
export type MostFollowersMember = z.infer<
  typeof mostFollowersMemberSchema
>[number]
