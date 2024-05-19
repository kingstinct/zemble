import {
  Plugin, setupProvider, type PushTokenWithMetadata, type SendPushProvider,
  type PushTokenWithMessage,
  type PushTokenWithMessageAndTicket,
  type TokenContents,
} from '@zemble/core'
import GraphQL from '@zemble/graphql'
import Routes from '@zemble/routes'
import { chunkArray } from '@zemble/utils/chunkArray'
import { Expo } from 'expo-server-sdk'

interface Config extends Zemble.GlobalConfig {
  readonly EXPO_ACCESS_TOKEN?: string
  readonly maxConcurrentRequests?: number,
  readonly useFcmV1?: boolean
  readonly persistPushToken: (decodedToken: TokenContents, pushTokenWithMetadata: Zemble.ExpoPushTokenWithMetadata) => Promise<void>
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface Providers {
      readonly sendPush: SendPushProvider
    }

    type ExpoPushTokenWithMetadata = {
      readonly type: 'EXPO',
      readonly platforms: readonly ('ios' | 'android' | 'web')[]
      readonly createdAt: Date
      readonly pushToken: string
    }

    interface PushTokenRegistry {
      readonly expo: ExpoPushTokenWithMetadata
    }

    interface MiddlewareConfig {
      readonly ['@zemble/expo-push']?: undefined
    }
  }
}

export const sendPush: SendPushProvider = async (pushTokens, message) => {
  // Create a new Expo SDK client
  // optionally providing an access token if you have enabled push security
  const expo = new Expo({
    accessToken: pushExpoPlugin.config.EXPO_ACCESS_TOKEN,
    useFcmV1: pushExpoPlugin.config.useFcmV1 ?? false, // this can be set to true in order to use the FCM v1 API
    maxConcurrentRequests: pushExpoPlugin.config.maxConcurrentRequests,
  })

  const somePushTokens = pushTokens.filter((token) => token.type === 'EXPO')

  const tokensWithMessages: readonly PushTokenWithMessage[] = somePushTokens.map((pushToken) => ({
    pushToken,
    message,
  }))

  // The Expo push notification service accepts batches of notifications so
  // that you don't need to send 1000 requests to send 1000 notifications. We
  // recommend you batch your notifications to reduce the number of requests
  // and to compress them (notifications with similar content will get
  // compressed).
  const chunks = chunkArray(tokensWithMessages, Expo.pushNotificationChunkSizeLimit)
  let successfulSends: readonly PushTokenWithMessageAndTicket[] = []
  let failedSendsToRemoveTokensFor: readonly PushTokenWithMetadata[] = []
  let failedSendsOthers: readonly PushTokenWithMessage[] = []
  //   const failedSendsToRetry: readonly TokenWithMessage[] = []

  // Send the chunks to the Expo push notification service. There are
  // different strategies you could use. A simple one is to send one chunk at a
  // time, which nicely spreads the load out over time:
  // eslint-disable-next-line no-restricted-syntax
  for (const chunk of chunks) {
    // eslint-disable-next-line no-await-in-loop
    const ticketChunk = await expo.sendPushNotificationsAsync(chunk.map((tokenWithMessage) => ({ ...tokenWithMessage.message, to: tokenWithMessage.pushToken.pushToken })))
    // eslint-disable-next-line no-loop-func
    chunk.forEach(({ message, pushToken }, index) => {
      const ticket = ticketChunk[index]
      if (ticket) {
        if (ticket.status === 'error') {
          if (ticket.details?.error === 'DeviceNotRegistered') {
            failedSendsToRemoveTokensFor = [...failedSendsToRemoveTokensFor, pushToken]
          } else if (ticket.details?.error) {
            pushExpoPlugin.providers.logger.error(`${ticket.details.error}: ${ticket.message}`, { ticket, message, pushToken })
            failedSendsOthers = [...failedSendsOthers, { message, pushToken }]
          } else {
            pushExpoPlugin.providers.logger.error(`Unknown error: ${ticket.message}`, { ticket, message, pushToken })
          }
        } else {
          successfulSends = [...successfulSends, { message, pushToken, ticketId: ticket.id }]
        }
      } else {
        pushExpoPlugin.providers.logger.error(`Expo ticket is undefined, something went wrong`)
      }
    })
    // NOTE: If a ticket contains an error code in ticket.details.error, you
    // must handle it appropriately. The error codes are listed in the Expo
    // documentation:
    // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
  }

  return { failedSendsToRemoveTokensFor, failedSendsOthers, successfulSends }
}

const pushExpoPlugin = new Plugin<Config>(
  import.meta.dir,
  {
    middleware: async ({ app }) => {
      await setupProvider({
        app,
        initializeProvider: () => sendPush,
        providerKey: 'sendPush',
        middlewareKey: '@zemble/expo-push',
      })
    },
    dependencies: [{ plugin: GraphQL }],
  },
)

export default pushExpoPlugin
