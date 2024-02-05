import dayjs from 'dayjs'
import tz from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import type { Dayjs } from 'dayjs'

dayjs.extend(utc)
dayjs.extend(tz)

type UniversalDateTimeInterpretation = 'endOfDay' | 'startOfDay'

export const universalDateTimeToDayjs = (
  universalDateTime: Dayjs | string,
  interpretDate: UniversalDateTimeInterpretation = 'startOfDay',
) => {
  if (typeof universalDateTime === 'string') {
    const dayInDefaultTimezone = dayjs(universalDateTime).tz()
    const startOrEndOfDay = interpretDate === 'endOfDay'
      ? dayInDefaultTimezone.endOf('day')
      : dayInDefaultTimezone.startOf('day')

    return startOrEndOfDay
  }
  return universalDateTime
}

export const universalDateTimeToDateString = (
  universalDateTime: Dayjs | string,
): string => {
  if (typeof universalDateTime === 'string') {
    return universalDateTime
  }
  return universalDateTime.format('YYYY-MM-DD')
}

export const universalDateTimeToDate = (
  universalDateTime: Dayjs | string,
  interpretDate: UniversalDateTimeInterpretation = 'startOfDay',
) => universalDateTimeToDayjs(universalDateTime, interpretDate).toDate()

export default universalDateTimeToDayjs
