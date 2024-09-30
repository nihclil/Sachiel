'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { type Hex } from 'viem'

import { type PublisherData } from '@/app/actions/get-all-publishers'
import { sponsorPublisher } from '@/app/actions/payment'
import SendTransaction from '@/components/alchemy/send-transaction'
import Button from '@/components/button'
import Icon from '@/components/icon'
import Spinner from '@/components/spinner'
import { useUser } from '@/context/user'

import SponsorInput from './sponsor-input'
import SponsorOption from './sponsor-option'

export default function SponsorshipInfo({
  publisher,
}: {
  publisher: PublisherData
}) {
  const { user } = useUser()
  const router = useRouter()
  const [isInputMode, setIsInputMode] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [sponsorValue, setSponsorValue] = useState('')
  const amount = parseInt(sponsorValue)
  const isReady = amount > 0
  const [isSyncing, setIsSyncing] = useState(false)
  const [isSponsored, setIsSponsored] = useState(false)
  //TODO: replace with media sca
  const recipientAddress = '0xABD79306a5bD03B667F24a7013Af63238288a0aE'

  const handleUserOperationSuccess = async (hash: Hex) => {
    setIsSyncing(true)
    const txr = {
      memberId: user.memberId,
      publisherId: publisher.id,
      tid: hash,
      fee: `${amount}`,
    }
    const response = await sponsorPublisher(txr)
    if (response) {
      setIsSponsored(true)
    }
    setIsSyncing(false)
  }

  const onClickOption = (option: number, value: number | undefined) => {
    setSelectedOption(option)
    setSponsorValue(`${value ?? ''}`)
  }

  return (
    <main className="flex flex-col">
      {isSponsored ? (
        <div className="flex h-[calc(100vh-130px)] items-center justify-center">
          <div className="flex w-dvw max-w-[295px] flex-col items-center sm:max-w-[320px]">
            <Icon
              iconName="icon-check-circle-lg"
              size={{ width: 64, height: 64 }}
              className="pb-4"
            />
            <p className="title-2 pb-1 text-primary-700">支付成功</p>
            <p className="body-2 pb-6 text-primary-500">
              您成功贊助了
              <span className="text-custom-blue">{publisher.title}</span>
            </p>
            <Button
              size="lg"
              color="white"
              text="完成"
              onClick={() => {
                router.back()
                setIsSponsored(false)
              }}
            />
          </div>
        </div>
      ) : isInputMode ? (
        <SponsorInput
          sponsorValue={sponsorValue}
          setSponsorValue={setSponsorValue}
        />
      ) : (
        <SponsorOption
          publisherTitle={publisher.title ?? ''}
          selectedOption={selectedOption}
          onClick={onClickOption}
        />
      )}

      {isSponsored ? null : (
        <div className="fixed bottom-0 left-0 w-full max-w-[600px] border-t border-primary-200 bg-white px-5 py-3 sm:static sm:border-0 sm:py-0">
          {isReady ? (
            isSyncing ? (
              <div className="flex h-[46px] justify-center">
                <Spinner />
              </div>
            ) : (
              <SendTransaction
                amount={amount}
                recipientAddress={recipientAddress}
                disabled={selectedOption === null}
                handleSuccess={handleUserOperationSuccess}
              />
            )
          ) : (
            <div className="flex w-full justify-center">
              <div className="shrink-0 grow sm:max-w-[335px]">
                <Button
                  size="lg"
                  text={isInputMode ? '上一步' : '下一步'}
                  color="primary"
                  disabled={selectedOption !== 3}
                  onClick={() => setIsInputMode(!isInputMode)}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
