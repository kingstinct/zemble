const alert = async (title: string, message?: string) =>
  new Promise<void>((resolve) => {
    resolve(window.alert([title, message].filter(Boolean).join('\n')))
  })

export function useAlert() {
  return alert
}

export default useAlert
