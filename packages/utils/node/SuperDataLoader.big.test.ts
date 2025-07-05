import { describe, expect, it } from 'bun:test'
import { makeExecutableSchema } from '@graphql-tools/schema'
import DataLoader from 'dataloader'
import { graphql, Source } from 'graphql'
import gql from 'graphql-tag'

import { createSuperDataLoader } from './SuperDataLoader'
import expanded from './tst_data/expanded.json'
import instruments from './tst_data/instruments.json'
import issuers from './tst_data/issuers.json'
import transactionItemsArray from './tst_data/transactionItemsArray.json'

const INSTRUMENTS_BY_ID: Record<
  string,
  { readonly _id: string; readonly issuerId: string }
> = instruments
const ISSUER_BY_ID: Record<string, { readonly _id: string }> = issuers
const TRANSACTION_ITEMS = transactionItemsArray as unknown as ReadonlyArray<{
  readonly _id: string
  readonly instrumentId: string
}>

function instrumentById() {
  return async (keys: readonly string[]) => {
    const result = keys.map((id) => INSTRUMENTS_BY_ID[id] || null)
    return result
  }
}

function issuerById() {
  return async (keys: readonly string[]) => {
    const result = keys.map((id) => ISSUER_BY_ID[id] || null)
    return result
  }
}

type DataLoaders = {
  readonly instrumentById: DataLoader<string, unknown, unknown>
  readonly issuerById: DataLoader<string, unknown, unknown>
}

function initDataLoaders() {
  const dls: DataLoaders = {
    instrumentById: new DataLoader(instrumentById(), {
      cacheKeyFn: (_id) => _id.toString(),
    }),
    issuerById: new DataLoader(issuerById(), {
      cacheKeyFn: (_id) => _id.toString(),
    }),
  }
  return dls
}

function initSuperDataLoaders() {
  const instrumentLoader = createSuperDataLoader({
    batchLoadFn: instrumentById(),
    cacheKeyFn: (_id) => _id.toString(),
  })
  const issuerLoader = createSuperDataLoader({
    batchLoadFn: issuerById(),
    cacheKeyFn: (_id) => _id.toString(),
  })

  const dls = {
    instrumentById: instrumentLoader,
    issuerById: issuerLoader,
  }
  return dls
}

describe('SuperDataLoader.big', () => {
  it('trivial', async () => {
    const dataloaders = initDataLoaders()

    const instrument = await dataloaders['instrumentById']?.load(
      '558ba89433d865236cb94bda',
    )

    expect(instrument).toStrictEqual({
      _id: '558ba89433d865236cb94bda',
      issuerId: '5c4700e90a40e1000171e371',
    })

    const issuer = await dataloaders['issuerById']?.load(
      '561a62f35548753344e7252f',
    )

    expect(issuer).toStrictEqual({
      _id: '561a62f35548753344e7252f',
    })
  }, 20000)

  it('expand', async () => {
    const dataloaders = initDataLoaders()

    const instrumentIds: readonly string[] = TRANSACTION_ITEMS.map(
      (item) => item.instrumentId,
    )

    const startDataLoader = performance.now()
    const loadedInstruments =
      await dataloaders['instrumentById']?.loadMany(instrumentIds)
    const endDataLoader = performance.now()

    expect(loadedInstruments).toHaveLength(95022)

    const superDataLoaders = initSuperDataLoaders()

    const startSuperDataLoader = performance.now()
    const loadedInstruments2 =
      await superDataLoaders.instrumentById?.loadMany(instrumentIds)
    const endSuperDataLoader = performance.now()

    const dataloaderTime = endDataLoader - startDataLoader
    const superDataLoaderTime = endSuperDataLoader - startSuperDataLoader

    console.log(
      `[(async)]:\n[SuperDataLoader]: ${superDataLoaderTime}\n[DataLoader]: ${dataloaderTime}\n${dataloaderTime / superDataLoaderTime}x) faster}`,
    )

    expect(loadedInstruments2).toHaveLength(95022)
  }, 20000)

  it('with graphql', async () => {
    const dataloaders = initDataLoaders()
    const superDataLoaders = initSuperDataLoaders()

    const typeDefinition = gql`
    type Query  {
       transactionItems: [TransactionItem!]!
    }
    
    type TransactionItem {
      _id: String!
      instrumentId: String!
      instrument: Instrument
    }

    type Instrument {
      _id: String!
      issuerId: String!
      issuer: Issuer
    }

    type Issuer {
      _id: String!
    }
    `

    const resolverObject = {
      Query: {
        transactionItems: () => TRANSACTION_ITEMS,
      },
      TransactionItem: {
        instrument: async (
          { instrumentId }: { readonly instrumentId: string },
          _: unknown,
          { dataloaders }: { readonly dataloaders: DataLoaders },
        ) => dataloaders.instrumentById.load(instrumentId),
      },
      Instrument: {
        issuer: async (
          { issuerId }: { readonly issuerId: string },
          _: unknown,
          { dataloaders }: { readonly dataloaders: DataLoaders },
        ) => (issuerId ? dataloaders.issuerById.load(issuerId) : null),
      },
    }

    const schema = makeExecutableSchema({
      typeDefs: typeDefinition,
      resolvers: resolverObject,
    })

    const query = gql`
      query {
        transactionItems {
          _id
          instrumentId
          instrument {
            _id
            issuerId
            issuer {
              _id
            }
          }
        }
      }
    `

    const startDataLoader = performance.now()
    let result = await graphql({
      schema,
      source: query.loc?.source as Source,
      rootValue: {},
      contextValue: { dataloaders },
      variableValues: {},
    })
    const endDataLoader = performance.now()
    expect(result.errors).toBeUndefined()

    let transactionItems = result?.data?.['transactionItems']

    expect(transactionItems).toBeDefined()
    expect(transactionItems).toHaveLength(95022)

    expect(transactionItems).toEqual((expanded as any).transactionItems)

    const startSuperDataLoader = performance.now()
    result = await graphql({
      schema,
      source: query.loc?.source as Source,
      rootValue: {},
      contextValue: { dataloaders: superDataLoaders },
      variableValues: {},
    })
    const endSuperDataLoader = performance.now()
    expect(result.errors).toBeUndefined()

    transactionItems = result?.data?.['transactionItems']

    expect(transactionItems).toBeDefined()
    expect(transactionItems).toHaveLength(95022)

    expect(transactionItems).toEqual((expanded as any).transactionItems)

    const dataloaderTime = endDataLoader - startDataLoader
    const superDataLoaderTime = endSuperDataLoader - startSuperDataLoader

    console.log(
      `[(async)]:\n[SuperDataLoader]: ${superDataLoaderTime}\n[DataLoader]: ${dataloaderTime}\n${dataloaderTime / superDataLoaderTime}x) faster}`,
    )
  }, 20000)
})
