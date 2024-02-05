import dayjs from 'dayjs'

function* dateGenerator(from: string, to: string, includeFuture: boolean) {
  let currentDate = dayjs(from)

  while (!currentDate.isAfter(to) && (includeFuture || !currentDate.subtract(1, 'day').isAfter(dayjs().endOf('day')))) {
    yield currentDate.format('YYYY-MM-DD')

    currentDate = currentDate.add(1, 'day')
  }
}

export function dateRange(from: string, to: string, includeFuture = true) {
  return Array.from(dateGenerator(from, to, includeFuture))
}

export default dateRange
