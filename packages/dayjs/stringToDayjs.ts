import dayjs from 'dayjs'
import tz from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(tz)
dayjs.extend(utc)

const REGEX_TIMEZONE_OFFSET_FORMAT = /^.*([+-]\d{2}:?\d{2}|[+-]\d{2}|Z)$/

export const stringToDayjs = (dateStr: string) => {
  const rawDate = dayjs(dateStr)

  const timezoneInfo = dateStr.match(REGEX_TIMEZONE_OFFSET_FORMAT)

  if (timezoneInfo) {
    const [, offset] = timezoneInfo

    if (offset === 'Z') {
      return rawDate.utc() // use UTC timezone
    }

    if (offset) {
      return rawDate.utcOffset(offset, false) // keep timestamp identity, but change timezone
    }
  }

  return rawDate.tz() // use dayjs default timezone (local by default)
}
