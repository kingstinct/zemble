const alert = async (title: string, message?: string) => new Promise<void>((resolve) => {
  // eslint-disable-next-line no-alert
  resolve(window.alert([title, message].filter(Boolean).join('\n')))
})

export function useAlert() {
  return alert
}

export default useAlert
