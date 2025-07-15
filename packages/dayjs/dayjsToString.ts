import dayjs from 'dayjs'
import tz from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(tz)
dayjs.extend(utc)

// dayjs to string, preserving timezone and milliseconds
export const dayjsToString = (value: dayjs.Dayjs) => {
  if (value.millisecond() !== 0) {
    if (value.isUTC()) {
      return value.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
    }
    return value.format('YYYY-MM-DDTHH:mm:ss.SSSZ')
  }
  return value.format()
}
