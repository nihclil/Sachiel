import { useRef, useState } from 'react'

export const useForm = <T extends Record<string, unknown>>(
  initialState: T,
  validateFormFn: (form: T) => Partial<T>
) => {
  const originalState = useRef(initialState)
  const [form, setForm] = useState<T>(initialState)
  const [errors, setErrors] = useState<Partial<T>>({})

  const updateField = (field: keyof T, value: T[keyof T]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [field]: _, ...rest } = prev
      return rest as Partial<T>
    })
  }

  const resetForm = () => {
    setForm(initialState)
  }

  const validateForm = () => {
    const newErrors = validateFormFn(form)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const resetErrors = () => setErrors({})

  const updateErrors = (key: keyof T, errorMessage: string) => {
    setErrors((prev) => ({ ...prev, [key]: errorMessage }))
  }

  const isFormDataChanged = () => {
    for (const [key, value] of Object.entries(
      originalState.current as Record<keyof T, string>
    )) {
      if (form[key] !== value) return true
    }
    return false
  }

  const hasChange = () => {
    for (const [formField, FormValue] of Object.entries(
      originalState.current
    )) {
      if (FormValue !== form[formField]) return true
    }
    return false
  }

  const isFormValid = Object.keys(errors).length === 0 && hasChange()

  return {
    form,
    isFormValid,
    isFormDataChanged,
    errors,
    updateField,
    resetForm,
    updateErrors,
    validateForm,
    resetErrors,
  }
}
