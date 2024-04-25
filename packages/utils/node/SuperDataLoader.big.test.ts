/* eslint-disable no-console */
import { describe, it, expect } from 'bun:test'
import DataLoader from 'dataloader'

import instruments from './tst_data/instruments.json'
import issuers from './tst_data/issuers.json'

const INSTRUMENTS_BY_ID: Record<string, { readonly _id: string; readonly issuerId: string }> = instruments
const ISSUER_BY_ID: Record<string, { readonly _id: string }> = issuers

function instrumentById() {
  return async (ids: readonly string[]) => {
    const result = ids.map((id) => INSTRUMENTS_BY_ID[id] || null)
    return result
  }
}

function issuerById() {
  return async (ids: readonly string[]) => {
    const result = ids.map((id) => ISSUER_BY_ID[id] || null)
    return result
  }
}

function initDataLoaders() {
  const dls: Record<string, DataLoader<unknown, unknown, unknown>> = {
    instrumentById: new DataLoader(instrumentById(), { cacheKeyFn: (_id) => _id.toString() }),
    issuerById: new DataLoader(issuerById(), { cacheKeyFn: (_id) => _id.toString() }),
  }
  return dls
}

describe('SuperDataLoader.big', () => {
  it('trivial', async () => {
    const dataloaders = initDataLoaders()

    const instrument = await dataloaders.instrumentById?.load('558ba89433d865236cb94bda')

    expect(instrument).toStrictEqual({
      _id: '558ba89433d865236cb94bda',
      issuerId: '5c4700e90a40e1000171e371',
    })

    const issuer = await dataloaders.issuerById?.load('561a62f35548753344e7252f')

    expect(issuer).toStrictEqual({
      _id: '561a62f35548753344e7252f',
    })
  }, 20000)
})
