import { useEffect, useState } from 'react'

import { getInvalidNameList } from '@/app/actions/get-invalid-names'
import Button from '@/components/button'
import Icon from '@/components/icon'
import { useLogin } from '@/context/login'
import { debounce } from '@/utils/performance'

const validationMessages = [
  '姓名在 2-32 字間',
  '不包含特殊符號',
  '沒有跟媒體名稱重複',
]

export default function LoginSetName() {
  const { formData, setFormData, setStep } = useLogin()
  const { name } = formData
  const [invalidNames, setInvalidNames] = useState<string[]>([])

  useEffect(() => {
    const fetchInvalidNames = async () => {
      const data = await getInvalidNameList()
      if (data) {
        setInvalidNames(data)
      }
    }
    fetchInvalidNames()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      debounce(handleSubmit)()
    }
  }

  const { validCondition, isValid } = isValidName(invalidNames, name)

  const handleSubmit = () => {
    if (isValid) {
      setStep('set-category')
    }
  }

  return (
    <div className="flex flex-col items-center gap-10 px-5 pb-10 pt-5 sm:px-10">
      <Icon iconName="icon-login-step-1" size={{ width: 335, height: 20 }} />
      <div>
        <input
          className="w-full appearance-none border-b border-primary-200"
          type="text"
          value={name}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
          onKeyDown={handleKeyDown}
          autoFocus
          required
        ></input>
        <div className="pt-2">
          {validationMessages.map((message, idx) => (
            <div
              key={idx}
              className={`flex h-6 flex-row items-center gap-1 ${
                validCondition.includes(idx)
                  ? 'text-custom-blue'
                  : 'text-primary-500'
              }`}
            >
              <Icon
                iconName={
                  validCondition.includes(idx)
                    ? 'icon-check-circle-blue'
                    : 'icon-check-circle-gray'
                }
                size="m"
              />
              <p className="body-3">{message}</p>
            </div>
          ))}
        </div>
        <p className="footnote pt-3 text-primary-500">
          輸入您想使用的公開顯示名稱。我們鼓勵使用者填寫真實姓名。這裡可以放其他規定。字數限制。之類的。
        </p>
      </div>
      <div className="w-full max-w-[320px] px-5">
        <Button
          size="lg"
          color="primary"
          text="下一步"
          onClick={handleSubmit}
          disabled={!isValid}
        />
      </div>
    </div>
  )
}

function isValidName(invalidNames: string[], name: string) {
  const nameRegex = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/
  const validCondition: number[] = []
  if (!invalidNames.length || !name) return { validCondition, isValid: false }

  let isMatchInvalidNames = false
  const lowerCaseName = name.toLowerCase()

  for (const str of invalidNames) {
    const lowerCaseStr = str.toLowerCase()
    if (
      lowerCaseName.startsWith(lowerCaseStr) ||
      lowerCaseName.endsWith(lowerCaseStr) ||
      lowerCaseName.includes(lowerCaseStr)
    ) {
      isMatchInvalidNames = true
      break
    }
  }

  if (!isMatchInvalidNames) {
    validCondition.push(2)
  }
  if (nameRegex.test(name)) {
    validCondition.push(1)
  }
  if (2 <= name.length && name.length <= 32) {
    validCondition.push(0)
  }
  const isValid = validCondition.length === 3

  return { validCondition, isValid }
}
