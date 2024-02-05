export function onTimeout(timeout: number, handler: () => void) {
  const timeoutId = setTimeout(handler, timeout)
  return () => clearTimeout(timeoutId)
}

export default onTimeout
