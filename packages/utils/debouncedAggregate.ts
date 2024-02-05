type Opts = {
  readonly maxItems?: number,
  readonly maxMs?: number,
}

function debouncedAggregate<T>(ms: number, fn: (items: readonly T[]) => void, opts?: Opts) {
  let timeout: NodeJS.Timeout | undefined
  let lastInit: number | undefined
  // eslint-disable-next-line functional/prefer-readonly-type
  let items: T[] = []

  const executeAndReset = () => {
    lastInit = undefined
    fn(items)
    items = []
  }

  return (item: T) => {
    if (!lastInit) {
      lastInit = Date.now()
    }
    clearTimeout(timeout)
    // eslint-disable-next-line functional/immutable-data
    items.push(item)

    const timeSinceStart = Date.now() - lastInit

    if (opts?.maxItems && items.length >= opts?.maxItems) {
      executeAndReset()
    } else if (opts?.maxMs && timeSinceStart >= opts.maxMs) {
      executeAndReset()
    } else {
      const actualMs = opts?.maxMs ? Math.min(ms, opts.maxMs - timeSinceStart) : ms

      timeout = setTimeout(executeAndReset, actualMs)
    }
  }
}

export default debouncedAggregate
