'use client'

import { type User, deleteUser, onAuthStateChanged } from 'firebase/auth'
import type { FirebaseError } from 'firebase-admin/app'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'

import { deactiveMember } from '@/app/actions/auth'
import Button from '@/components/button'
import { DELETION_STEP } from '@/constants/config'
import { useUser } from '@/context/user'
import { auth } from '@/firebase/client'

import ConfirmationLayout from './confirmation-layout'

type StepType = typeof DELETION_STEP[keyof typeof DELETION_STEP]

type Props = {
  setDeleteStatus: Dispatch<SetStateAction<StepType>>
}

export default function Confirmation({ setDeleteStatus }: Props) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const { user } = useUser()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user)
      } else {
        setCurrentUser(null)
      }
    })
    return () => unsubscribe()
  }, [])

  const memberId = user.memberId
  if (!memberId) redirect('/login')

  const handleDeleteMember = async () => {
    if (!currentUser) {
      return
    }

    try {
      await deleteUser(currentUser)
      const result = await deactiveMember(memberId)
      if (!result.success) {
        setDeleteStatus(DELETION_STEP.FAILURE)
      }
      setDeleteStatus(DELETION_STEP.SUCCESS)
    } catch (error) {
      const err = error as FirebaseError
      console.error(err.code)
      setDeleteStatus(DELETION_STEP.FAILURE)
    }
  }

  return (
    <ConfirmationLayout>
      <section className="flex w-full flex-col items-center justify-center sm:h-screen sm:bg-multi-layer-light">
        <div className="flex flex-col items-center gap-y-6 bg-single-layer px-5 pt-10 sm:w-[480px] sm:rounded-md sm:p-10 sm:shadow-[0_0_4px_0_rgba(0,9,40,0.1),0_2px_2px_0_rgba(0,9,40,0.1)]">
          <div className="flex flex-col items-center">
            <p className="title-2 mb-2 text-primary-700 sm:mb-1">
              真的要刪除帳號嗎？
            </p>
            <p className="body-2 text-center text-primary-500">
              提醒您：刪除帳號後，您的帳號資訊將永久刪除並無法復原。
            </p>
          </div>
          <div className="w-full max-w-[295px] sm:max-w-[320px]">
            <Link href="/setting">
              <Button size="lg" color="transparent" text="那我再想想" />
            </Link>
          </div>
          <button
            onClick={() => handleDeleteMember()}
            className="button text-custom-red-text"
          >
            確認刪除
          </button>
        </div>
      </section>
    </ConfirmationLayout>
  )
}
