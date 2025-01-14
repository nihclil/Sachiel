// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => void | Promise<void>>(
  func: T,
  timeout = 300
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

export { debounce }
