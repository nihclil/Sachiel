import type { Politic } from '~/types/politics'
import type { RawPolitic } from '~/types/common'
import { print } from 'graphql'
import {
  usePersonElectionId,
  usePoliticAmount,
} from './react-context/use-politics'
import { useToast } from '../toast/use-toast'
import { fireGqlRequest } from '~/utils/utils'
import PoliticForm from './politic-form'
import CreatePolitic from '~/graphql/mutation/politics/create-politic.graphql'
import s from './add-politic-form.module.css'

type AddPoliticFormProps = {
  closeForm: () => void
}

export default function AddPoliticForm(
  props: AddPoliticFormProps
): JSX.Element {
  const defaultPolitic: Politic = {
    desc: '',
    source: '',
  }

  const toast = useToast()
  const politicAmount = usePoliticAmount()
  const personElectionId: string = usePersonElectionId()

  // client side only
  async function createPolitic(data: Politic): Promise<boolean> {
    const cmsApiUrl = `${window.location.origin}/api/data`

    try {
      const variables = {
        data: {
          person: {
            connect: {
              id: personElectionId,
            },
          },
          desc: data.desc,
          source: data.source,
        },
      }
      const result: RawPolitic = await fireGqlRequest(
        print(CreatePolitic),
        variables,
        cmsApiUrl
      )

      const amount = politicAmount.amount
      politicAmount.setAmount({
        ...amount,
        waiting: amount.waiting + 1,
      })

      toast.open({
        status: 'success',
        title: '送出成功',
        desc: '通過志工審核後，您新增的政見就會出現在這裡',
      })

      props.closeForm()

      return true
    } catch (err) {
      console.error(err)

      toast.open({
        status: 'fail',
        title: '出了點問題...',
        desc: '送出失敗，請重試一次',
      })

      return false
    }
  }

  return (
    <form className={s['form']} method="POST">
      <span className={s['title']}>新增政見</span>
      <PoliticForm
        politic={defaultPolitic}
        closeForm={props.closeForm}
        submitForm={createPolitic}
      />
    </form>
  )
}
