import dayjs from 'dayjs'

import { universalDateTimeToDate, universalDateTimeToDateString } from './universalDateTimeToDayjs'

describe('universalDateTimeToDayjs', () => {
  it('convert dateString to date', () => {
    const date = '2021-01-01'
    expect(universalDateTimeToDate(date)).toEqual(new Date(2021, 0, 1))
  })

  it('convert dateString to dateString', () => {
    const date = '2021-01-01'
    expect(universalDateTimeToDateString(date)).toEqual(date)
  })

  it('convert date to dateString', () => {
    const day = dayjs()
    const todayString = day.format('YYYY-MM-DD')
    expect(universalDateTimeToDateString(day)).toEqual(todayString)
  })

  it('convert dayjs to date', () => {
    const day = dayjs()
    const now = new Date()

    expect(universalDateTimeToDate(day)).toEqual(now)
  })
})
