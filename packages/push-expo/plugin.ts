import {
  Plugin,
  type PushMessage,
  type PushTokenWithContentsAndFailedReason,
  type PushTokenWithContentsAndTicket,
  type PushTokenWithMetadata,
  type SendPushProvider,
  type SendPushResponse,
  type SendSilentPushProvider,
  setupProvider,
  type TokenContents,
} from '@zemble/core'
import GraphQL from '@zemble/graphql'
import { chunkArray } from '@zemble/utils/chunkArray'
import type { JSON } from '@zemble/utils/JSON'
import { Expo, type ExpoPushMessage } from 'expo-server-sdk'

interface Config extends Zemble.GlobalConfig {
  readonly EXPO_ACCESS_TOKEN?: string
  readonly maxConcurrentRequests?: number
  readonly useFcmV1?: boolean
  readonly persistPushToken: (
    decodedToken: TokenContents,
    pushTokenWithMetadata: ExpoPushTokenWithMetadata,
  ) => Promise<void>
}

export interface ExpoPushTokenWithMetadata {
  readonly type: 'EXPO'
  readonly platform: 'ios' | 'android' | 'web'
  readonly pushToken: string
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface Providers {
      readonly sendPush: SendPushProvider
      readonly sendSilentPush: SendSilentPushProvider
    }

    interface PushTokenRegistry {
      readonly expo: ExpoPushTokenWithMetadata
    }

    interface MiddlewareConfig {
      readonly ['@zemble/push-expo']?: undefined
    }
  }
}

type TokenWithSilentMessage = {
  readonly pushToken: ExpoPushTokenWithMetadata
  readonly contents: Record<string, JSON>
}
type TokenWithMessage = {
  readonly pushToken: ExpoPushTokenWithMetadata
  readonly contents: PushMessage
}

export async function processPushes<
  T extends TokenWithSilentMessage | TokenWithMessage,
>(
  tokensWithMessages: readonly T[],
  mapContent: (tokenWithMessage: T) => ExpoPushMessage,
) {
  const expo = getClient()

  const chunks = chunkArray(
    tokensWithMessages,
    Expo.pushNotificationChunkSizeLimit,
  )
  let successfulSends: readonly PushTokenWithContentsAndTicket<ExpoPushTokenWithMetadata>[] =
    []
  let failedSendsToRemoveTokensFor: readonly PushTokenWithMetadata[] = []
  let failedSendsOthers: readonly PushTokenWithContentsAndFailedReason<ExpoPushTokenWithMetadata>[] =
    []
  //   const failedSendsToRetry: readonly TokenWithMessage[] = []
  // Send the chunks to the Expo push notification service. There are
  // different strategies you could use. A simple one is to send one chunk at a
  // time, which nicely spreads the load out over time:
  // eslint-disable-next-line no-restricted-syntax
  for (const chunk of chunks) {
    // eslint-disable-next-line no-await-in-loop
    const ticketChunk = await expo.sendPushNotificationsAsync(
      chunk.map(mapContent),
    )
    // eslint-disable-next-line no-loop-func
    chunk.forEach(({ contents, pushToken }, index) => {
      const ticket = ticketChunk[index]
      if (ticket) {
        if (ticket.status === 'error') {
          if (ticket.details?.error === 'DeviceNotRegistered') {
            failedSendsToRemoveTokensFor = [
              ...failedSendsToRemoveTokensFor,
              pushToken,
            ]
          } else if (ticket.details?.error) {
            pushExpoPlugin.providers.logger.error(
              `${ticket.details.error}: ${ticket.message}`,
              { ticket, contents, pushToken },
            )
            failedSendsOthers = [
              ...failedSendsOthers,
              {
                contents,
                pushToken,
                failedReason: ticket.details.error,
              },
            ]
          } else {
            pushExpoPlugin.providers.logger.error(
              `Unknown error: ${ticket.message}`,
              { ticket, contents, pushToken },
            )
          }
        } else {
          successfulSends = [
            ...successfulSends,
            { contents, pushToken, ticketId: ticket.id },
          ]
        }
      } else {
        pushExpoPlugin.providers.logger.error(
          `Expo ticket is undefined, something went wrong`,
        )
      }
    })
    // NOTE: If a ticket contains an error code in ticket.details.error, you
    // must handle it appropriately. The error codes are listed in the Expo
    // documentation:
    // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
  }

  const response: SendPushResponse<ExpoPushTokenWithMetadata> = {
    failedSendsToRemoveTokensFor,
    failedSendsOthers,
    successfulSends,
  }

  return response
}

const getClient = () => {
  const expo = new Expo({
    accessToken: pushExpoPlugin.config.EXPO_ACCESS_TOKEN,
    useFcmV1: pushExpoPlugin.config.useFcmV1 ?? false, // this can be set to true in order to use the FCM v1 API
    maxConcurrentRequests: pushExpoPlugin.config.maxConcurrentRequests,
  })

  return expo
}

const mapSilentContent = (tokenWithMessage: {
  readonly pushToken: ExpoPushTokenWithMetadata
  readonly contents: Record<string, JSON>
}) => {
  const contents = {
    data: tokenWithMessage.contents,
    to: tokenWithMessage.pushToken.pushToken,
    _contentAvailable: true,
  } satisfies ExpoPushMessage

  return {
    ...contents,
    to: tokenWithMessage.pushToken.pushToken,
  }
}

export const sendSilentPush: SendSilentPushProvider = async (
  pushTokens,
  contents,
) => {
  const somePushTokens = pushTokens.filter((token) => token.type === 'EXPO')

  const tokensWithMessages = somePushTokens.map((pushToken) => ({
    pushToken,
    contents,
  }))

  return processPushes(tokensWithMessages, mapSilentContent)
}

const mapContent = (tokenWithMessage: TokenWithMessage) => {
  const contents = {
    ...tokenWithMessage.contents,
    sound: tokenWithMessage.contents.sound
      ? {
          ...tokenWithMessage.contents.sound,
          name: tokenWithMessage.contents.sound.name as
            | 'default'
            | null
            | undefined, // not sure how this is dealt with IRL, quite probable that it works with any sound file (since it looks like a more or less straight mapping to APNS)
        }
      : undefined,
    to: tokenWithMessage.pushToken.pushToken,
  } satisfies ExpoPushMessage
  return {
    ...contents,
    to: tokenWithMessage.pushToken.pushToken,
  }
}

export const sendPush: SendPushProvider = async (pushTokens, contents) => {
  const somePushTokens = pushTokens.filter((token) => token.type === 'EXPO')

  const tokensWithMessages = somePushTokens.map((pushToken) => ({
    pushToken,
    contents,
  }))

  return processPushes(tokensWithMessages, mapContent)
}

const pushExpoPlugin = new Plugin<Config>(import.meta.dir, {
  middleware: async ({ app }) => {
    await setupProvider({
      app,
      initializeProvider: () => sendPush,
      providerKey: 'sendPush',
      middlewareKey: '@zemble/push-expo',
    })

    await setupProvider({
      app,
      initializeProvider: () => sendSilentPush,
      providerKey: 'sendSilentPush',
      middlewareKey: '@zemble/push-expo',
    })
  },
  dependencies: [{ plugin: GraphQL }],
})

export default pushExpoPlugin
