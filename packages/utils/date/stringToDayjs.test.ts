import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import { stringToDayjs } from './stringToDayjs'

dayjs.extend(utc)
dayjs.extend(timezone)

describe('stringToDayjs', () => {
  test('stringToDayjs UTC', () => {
    const dateStr = '2019-11-01T11:00:00Z'
    const timestamp = new Date(dateStr).getTime()

    const result = stringToDayjs(dateStr)

    expect(result.format()).toBe(dateStr)
    expect(result.toISOString()).toBe(new Date(dateStr).toISOString())
    expect(result.utcOffset()).toBe(0)
    expect(result.valueOf()).toBe(timestamp)
  })

  test('stringToDayjs with no timezone', () => {
    const dateStr = '2019-11-01T11:00:00'
    const timestamp = new Date(dateStr).getTime()

    const localOffset = dayjs(dateStr).utcOffset() + 0

    const result = stringToDayjs(dateStr)

    expect(result.toISOString()).toBe(new Date(dateStr).toISOString())
    expect(result.utcOffset()).toBe(localOffset)
    expect(result.valueOf()).toBe(timestamp)
  })

  test('stringToDayjs with no timezone should be set based on default dayjs timezone', () => {
    const dateStr = '2019-11-01T11:00:00'
    const timestamp = new Date(dateStr).getTime()

    const newYorkOffset = dayjs(dateStr).tz('America/New_York').utcOffset()

    dayjs.tz.setDefault('America/New_York')

    const result = stringToDayjs(dateStr)

    expect(result.toISOString()).toBe(new Date(dateStr).toISOString())
    expect(result.utcOffset()).toBe(newYorkOffset)
    expect(result.valueOf()).toBe(timestamp)
  })

  test('stringToDayjs with +05:00', () => {
    const dateStr = '2019-11-01T11:00:00+05:00'
    const timestamp = new Date(dateStr).getTime()

    const result = stringToDayjs(dateStr)

    expect(result.format()).toBe(dateStr)
    expect(result.toISOString()).toBe(new Date(dateStr).toISOString())
    expect(result.utcOffset()).toBe(300)
    expect(result.valueOf()).toBe(timestamp)
  })
})
