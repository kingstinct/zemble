import { chunkArray } from '@zemble/utils/chunkArray'
import { Expo } from 'expo-server-sdk'

type GetReceiptsResponse = {
  readonly data: Record<string, { readonly status: 'ok' }>
}

export const getReceipts = async (receiptIds: readonly string[]) => {
  const chunks = chunkArray(receiptIds, Expo.pushNotificationReceiptChunkSizeLimit)

  let receipts: GetReceiptsResponse['data'] = {}

  // eslint-disable-next-line no-restricted-syntax
  for (const chunk of chunks) {
    // eslint-disable-next-line no-await-in-loop
    const response = await fetch('https://exp.host/--/api/v2/push/getReceipts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: chunk }),
    })

    // eslint-disable-next-line no-await-in-loop
    const resData = (await response.json()) as GetReceiptsResponse

    receipts = { ...receipts, ...resData.data }
  }
}
