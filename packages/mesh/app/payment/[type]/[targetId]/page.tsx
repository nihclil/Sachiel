import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'

import { getCurrentUser } from '@/app/actions/auth'
import getAllPublishers from '@/app/actions/get-all-publishers'
import { getStoryUnlockPolicy } from '@/app/actions/story'
import { PaymentType } from '@/types/payment'

import PaymentInfo from './_component/payment-info'
import SponsorshipInfo from './_component/sponsorship-info'

const AlchemyAuth = dynamic(() => import('@/components/alchemy/alchemy-auth'), {
  ssr: false,
})

export type StoryUnlockPolicy = Awaited<ReturnType<typeof getStoryUnlockPolicy>>

export default async function Page({
  params,
}: {
  params: { type: string; targetId: string }
}) {
  const { type, targetId } = params
  const user = await getCurrentUser()
  const memberId = user?.memberId ?? ''
  if (!memberId) notFound()
  const hasAlchemyAccount = !!user?.wallet

  switch (type) {
    case PaymentType.SubscriptionStory: {
      const unlockPolicy = await getStoryUnlockPolicy(targetId)
      if (!unlockPolicy.length) notFound()
      return (
        <AlchemyAuth
          hasAlchemyAccount={hasAlchemyAccount}
          renderComponent={
            <PaymentInfo unlockPolicy={unlockPolicy} storyId={targetId} />
          }
        />
      )
    }
    case PaymentType.Sponsor: {
      const allPublishers = await getAllPublishers()
      const publisher = allPublishers?.filter(
        (publisher) => publisher.id === targetId
      )
      if (!publisher?.length) notFound()
      //TODO: add AlchemyAuth
      return (
        <AlchemyAuth
          hasAlchemyAccount={hasAlchemyAccount}
          renderComponent={<SponsorshipInfo publisher={publisher[0]} />}
        />
      )
    }
    case PaymentType.SubscriptionPublisher:
    case PaymentType.Deposit:
      return <p>Payment Page to be implemented...</p>

    default:
      return <p>Invalid payment type</p>
  }
}
