import {
  parseEnvBoolean, parseEnvEnum, parseEnvJSON, parseEnvNumber,
} from './parseEnv'

test('parseEnvBoolean', () => {
  const result = parseEnvBoolean('isSomething', undefined, { isSomething: 'true' })

  expect(result).toEqual(true)
})

test('parseEnvBoolean default', () => {
  const result = parseEnvBoolean('isSomething', true, { })

  expect(result).toEqual(true)
})

test('parseEnvBoolean handle 1 gracefully', () => {
  const result = parseEnvBoolean('isSomething', undefined, { isSomething: '1' })

  expect(result).toEqual(true)
})

test('parseEnvBoolean handle 0 gracefully', () => {
  const result = parseEnvBoolean('isSomething', undefined, { isSomething: '0' })

  expect(result).toEqual(false)
})

test('parseEnvEnum should return the value set in process.env', () => {
  const result = parseEnvEnum('isSomething', ['value1', 'value2'], undefined, { isSomething: 'value1' })

  expect(result).toEqual('value1')
})

test('parseEnvEnum can be undefined if no default is set', () => {
  const res = parseEnvEnum('isSomething', ['value1', 'value2'], undefined, { isSomething: 'value3' })
  expect(res).toBeUndefined()
})

test('parseEnvEnum should use default value when not in range', () => {
  const result = parseEnvEnum(
    'isSomething',
    ['value1', 'value2'],
    'value1',
    { isSomething: 'value3' },
  )

  expect(result).toEqual('value1')
})

test('parseEnvNumber', () => {
  const result = parseEnvNumber('aNumber', undefined, { aNumber: '3' })

  expect(result).toEqual(3)
})

test('parseEnvJSON', () => {
  const result = parseEnvJSON('isSomething', { }, { isSomething: '{ "something": "cool" }' })

  expect(result).toEqual({ something: 'cool' })
})

test('parseEnvJSON return defaultValue when null', () => {
  const result = parseEnvJSON('isSomething', { defaultish: true }, { isSomething: undefined })

  expect(result).toEqual({ defaultish: true })
})
