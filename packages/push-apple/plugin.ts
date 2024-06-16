import {
  Plugin,
  type SendPushProvider,
  type PushMessage,
  type SendSilentPushProvider,
  type LiveActivityPushProps,
  type SendStartLiveActivityPushProvider,
  type SendPushResponse,
  type PushTokenWithContentsAndFailedReason,
  type PushTokenWithContentsAndTicket,
  type SendUpdateLiveActivityPushProvider,
  type AnyPushTokenWithMetadata,
} from '@zemble/core'
import GraphQL from '@zemble/graphql'

import {
  makeRequest, type ApnsBody, type Aps, type PushReturnType,
} from './clients/apns'
import {
  convertDateToSecondsSinceEpoch,
} from './utils'

import type {
  ApplePushOptions as PushApplePluginOptions,
  ApplePushTokenWithMetadata, AppleStartLiveActivityPushTokenWithMetadata, AppleUpdateLiveActivityPushTokenWithMetadata,
} from './types'
import type { JSON } from '@zemble/utils/JSON'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface Providers {
      readonly sendPush: SendPushProvider
      readonly sendSilentPush: SendSilentPushProvider
      readonly sendStartLiveActivityPush: SendStartLiveActivityPushProvider
      readonly sendUpdateLiveActivityPush: SendUpdateLiveActivityPushProvider
    }

    interface PushTokenRegistry {
      readonly apple: ApplePushTokenWithMetadata
    }

    interface PushTokenStartLiveActivityRegistry {
      readonly appleStartLiveActivity: AppleStartLiveActivityPushTokenWithMetadata
    }

    interface PushTokenUpdateLiveActivityRegistry {
      readonly appleUpdateLiveActivity: AppleUpdateLiveActivityPushTokenWithMetadata
    }

    interface MiddlewareConfig {
      readonly ['@zemble/push-apple']?: undefined
    }
  }
}

async function processPushResponses<TPush extends AnyPushTokenWithMetadata>(
  responses: readonly { readonly response: PushReturnType, readonly pushToken: TPush }[],
  contents: PushMessage | Omit<LiveActivityPushProps, 'attributesType' | 'attributes'> | Omit<LiveActivityPushProps, 'event'> | Record<string, JSON>,
) {
  const successfulSends = responses.filter(({ response }) => response.statusCode === 200).map(({ response, pushToken }) => ({
    contents,
    ticketId: response['apns-unique-id']!,
    pushToken,
  } as unknown as PushTokenWithContentsAndTicket<TPush>))

  const failedSendsToRemoveTokensFor = responses.filter(({ response }) => response.statusCode === 410).map(({ pushToken }) => pushToken)

  const failedSendsOthers = responses
    .filter(({ response }) => response.statusCode !== 200 && response.statusCode !== 410)
    .map(({ pushToken, response }) => ({
      failedReason: response.failedReason,
      contents,
      pushToken,
    } as unknown as PushTokenWithContentsAndFailedReason<TPush>))

  const response: SendPushResponse<TPush> = {
    failedSendsOthers,
    failedSendsToRemoveTokensFor,
    successfulSends,
  }

  await plugin.config.handleExpiredPushTokens(response.failedSendsToRemoveTokensFor)
  await plugin.config.handlePushTokenErrors?.(response.failedSendsOthers)

  return response
}

export const sendSilentPush: SendSilentPushProvider = async (
  pushTokens: readonly Zemble.PushTokenRegistry['apple'][],
  data: Record<string, JSON>,
) => {
  const body = {
    aps: {
      'content-available': 1 as const,
    } satisfies Aps,
    ...data,
  }

  const responses = await Promise.all(pushTokens.map(async (pushToken) => ({
    response: await makeRequest(body, pushToken, {
      'apns-push-type': 'background',
    }),
    pushToken,
  })))

  const processed: ReturnType<SendSilentPushProvider> = await processPushResponses(responses, data)

  return processed
}

export const updateLiveActivity: SendUpdateLiveActivityPushProvider<AppleUpdateLiveActivityPushTokenWithMetadata> = async (
  pushTokens,
  liveActivity,
) => {
  const body = {
    aps: {
      'content-state': liveActivity.contentState,
      'relevance-score': liveActivity.relevanceScore,
      'stale-date': liveActivity.staleDate ? convertDateToSecondsSinceEpoch(liveActivity.staleDate) : undefined,
      'event': liveActivity.event,
      'timestamp': convertDateToSecondsSinceEpoch(liveActivity.timestamp ? liveActivity.timestamp : new Date()),
      'dismissal-date': liveActivity.dismissalDate ? convertDateToSecondsSinceEpoch(liveActivity.dismissalDate) : undefined,
    } satisfies Aps,
  } satisfies ApnsBody

  const responses = await Promise.all(pushTokens.map(async (pushToken) => ({
    response: await makeRequest(body, pushToken, {
      'apns-push-type': 'liveactivity',
    }),
    pushToken,
  })))

  const processed = processPushResponses(responses, liveActivity)

  return processed
}

export const startLiveActivity: SendStartLiveActivityPushProvider<AppleStartLiveActivityPushTokenWithMetadata> = async (pushTokens, liveActivity) => {
  const body = {
    aps: {
      'content-state': liveActivity.contentState,
      'relevance-score': liveActivity.relevanceScore,
      'stale-date': liveActivity.staleDate ? convertDateToSecondsSinceEpoch(liveActivity.staleDate) : undefined,
      'event': 'start',
      'timestamp': convertDateToSecondsSinceEpoch(liveActivity.timestamp ?? new Date()),
      'attributes-type': liveActivity.attributesType,
      'dismissal-date': liveActivity.dismissalDate ? convertDateToSecondsSinceEpoch(liveActivity.dismissalDate) : undefined,
      'attributes': liveActivity.attributes,
      'alert': {
        'title': liveActivity.title,
        'body': liveActivity.body,
        'subtitle': liveActivity.subtitle,
        'loc-args': liveActivity.bodyLocalizationArgs,
        'loc-key': liveActivity.bodyLocalizationKey,
        'launch-image': liveActivity.launchImageName,
        'subtitle-loc-args': liveActivity.subtitleLocalizationArgs,
        'subtitle-loc-key': liveActivity.subtitleLocalizationKey,
        'title-loc-args': liveActivity.titleLocalizationArgs,
        'title-loc-key': liveActivity.titleLocalizationKey,
      },
      'sound': liveActivity.sound ? {
        critical: liveActivity.sound.critical ? 1 : 0,
        name: liveActivity.sound.name,
        volume: liveActivity.sound.volume,
      } : undefined,
    } satisfies Aps,
  }

  const responses = await Promise.all(pushTokens.map(async (pushToken) => ({
    response: await makeRequest(body, pushToken, {
      'apns-push-type': 'liveactivity',
    }),
    pushToken,
  })))

  const processed = processPushResponses(responses, liveActivity)

  return processed
}

export const sendPush: SendPushProvider = async (pushTokens, message: PushMessage) => {
  const body = {
    aps: {
      'alert': {
        'title': message.title,
        // subtitle: message.subtitle,
        'body': message.body,
        'subtitle': message.subtitle,
        'loc-args': message.bodyLocalizationArgs,
        'loc-key': message.bodyLocalizationKey,
        'launch-image': message.launchImageName,
        'subtitle-loc-args': message.subtitleLocalizationArgs,
        'subtitle-loc-key': message.subtitleLocalizationKey,
        'title-loc-args': message.titleLocalizationArgs,
        'title-loc-key': message.titleLocalizationKey,
      },
      'badge': message.badge,
      'category': message.categoryId,
      'sound': message.sound ? {
        critical: message.sound.critical ? 1 : 0,
        name: message.sound.name,
        volume: message.sound.volume,
      } : undefined,
      'thread-id': message.threadId,
    } satisfies Aps,
    ...message.data,
  }

  const responses = await Promise.all(pushTokens.map(async (pushToken) => ({
    response: await makeRequest(body, pushToken),
    pushToken,
  })))

  const processed = processPushResponses(responses, message)

  return processed
}

const defaultConfig: PushApplePluginOptions = {
  APPLE_TEAM_ID: process.env['APPLE_TEAM_ID'],
  APPLE_KEY_ID: process.env['APPLE_KEY_ID'],
  APPLE_PATH_TO_P8_KEY: process.env['APPLE_PATH_TO_P8_KEY'],
  APPLE_P8_KEY: process.env['APPLE_P8_KEY'],
  DEFAULT_TOPIC: process.env['DEFAULT_TOPIC'],
  persistPushToken: async (_, pushTokenInfo) => {
    plugin.providers.logger.error('[@zemble/push-apple] persistPushToken not configured', pushTokenInfo)
  },
  handleExpiredPushTokens: async (tokens) => {
    plugin.providers.logger.error('[@zemble/push-apple] handleExpiredPushTokens not configured', tokens)
  },
  handlePushTokenErrors: async (tokens) => {
    plugin.providers.logger.error('[@zemble/push-apple] handleBadPushTokens not configured, got bad tokens, maybe they\'re sandbox tokens?', tokens)
  },
}

const plugin = new Plugin<PushApplePluginOptions, typeof defaultConfig, typeof defaultConfig>(
  import.meta.dir,
  {
    dependencies: [{ plugin: GraphQL }],
    defaultConfig,
    providers: {
      sendPush: () => sendPush,
      sendSilentPush: () => sendSilentPush,
      sendStartLiveActivityPush: () => startLiveActivity,
      sendUpdateLiveActivityPush: () => updateLiveActivity,
    },
  },
)

export default plugin
