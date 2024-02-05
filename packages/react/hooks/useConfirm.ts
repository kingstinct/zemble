const confirm = async (title: string, message?: string) => new Promise<boolean>((resolve) => {
  // eslint-disable-next-line no-alert
  resolve(window.confirm([title, message].filter(Boolean).join('\n')))
})

export function useConfirm() {
  return confirm
}

export default useConfirm
