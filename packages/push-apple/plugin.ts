import {
  Plugin,
  type SendPushProvider,
  type PushMessage,
  type PushTokenWithMetadata,
  type SendSilentPushProvider,
  type LiveActivityPushProps,
  type SendStartLiveActivityPushProvider,
  type TokenContents,
  type SendPushResponse,
  type PushTokenWithContentsAndFailedReason,
  type PushTokenWithContentsAndTicket,
  type SendUpdateLiveActivityPushProvider,
} from '@zemble/core'
import GraphQL from '@zemble/graphql'
import * as jose from 'jose'
import http2 from 'node:http2'

import { readP8KeyStringOrFile } from './clients/apns'

import type { ApplePushPlatform } from './graphql/schema.generated'
import type { APNSError, Aps } from './types'
import type { JSON } from '@zemble/utils/JSON'

interface ApplePushOptions extends Zemble.GlobalConfig {
  readonly APPLE_TEAM_ID?: string
  readonly APPLE_KEY_ID?: string
  readonly APPLE_PATH_TO_P8_KEY?: string
  readonly APPLE_P8_KEY?: string
  readonly DEFAULT_TOPIC?: string
  readonly persistPushToken: (
    decodedToken: TokenContents,
    pushTokenWithMetadata: Zemble.ApplePushTokenWithMetadata | Zemble.AppleStartLiveActivityPushTokenWithMetadata | Zemble.AppleUpdateLiveActivityPushTokenWithMetadata,
  ) => Promise<void>
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface Providers {
      readonly sendPush: SendPushProvider
      readonly sendSilentPush: SendSilentPushProvider
      readonly sendStartLiveActivityPush: SendStartLiveActivityPushProvider
      readonly sendUpdateLiveActivityPush: SendUpdateLiveActivityPushProvider
    }

    type ApplePushTokenWithMetadata = {
      readonly type: 'APPLE',
      readonly platform: ApplePushPlatform
      readonly pushToken: string
      readonly appBundleId: string
    }

    type AppleStartLiveActivityPushTokenWithMetadata = {
      readonly type: 'APPLE_START_LIVE_ACTIVITY',
      readonly platform: ApplePushPlatform
      readonly pushToken: string
      readonly appBundleId: string
    }

    type AppleUpdateLiveActivityPushTokenWithMetadata = {
      readonly type: 'APPLE_UPDATE_LIVE_ACTIVITY',
      readonly platform: ApplePushPlatform
      readonly pushToken: string
      readonly appBundleId: string
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

/* const convertNowPlusSecondsToDate = (seconds: number) => {
  const now = new Date()
  now.setSeconds(now.getSeconds() + seconds)

  return now
} */

const convertDateToSecondsSinceEpoch = (date: Date) => Math.round(date.getTime() / 1000)

const getBearerToken = async () => {
  const signingKeyString = (await readP8KeyStringOrFile()) as unknown as string
  const signingKey = await jose.importPKCS8(signingKeyString, 'ES256')

  const bearerToken = new jose.SignJWT({
    iss: plugin.config.APPLE_TEAM_ID!,
    iat: Math.floor(Date.now() / 1000),
  }).setProtectedHeader({
    alg: 'ES256',
    kid: plugin.config.APPLE_KEY_ID!,
  })
    .sign(signingKey)

  return bearerToken
}

type PushReturnType = {
  readonly rawBody: string,
  readonly data?: Record<string, unknown>,
  readonly rawHeaders: ReadonlyMap<string, string | number>,
  readonly statusCode?: number,
  readonly 'apns-id'?: string,
  readonly 'apns-unique-id'?: string,
  readonly failedReason?: APNSError['error']
}

const mapDefaultPriority: Record<ApnsPushTypes, number> = {
  alert: 10,
  background: 5,
  location: 10,
  complication: 10,
  fileprovider: 10,
  mdm: 10,
  liveactivity: 10,
  voip: 10,
  pushtotalk: 10,
}

const topicSuffixes: Record<ApnsPushTypes, string> = {
  alert: '',
  background: '.background',
  location: '.location-query',
  complication: '.complication',
  fileprovider: '.pushkit.fileprovider',
  mdm: '.mdm',
  liveactivity: '.push-type.liveactivity',
  voip: '.voip',
  pushtotalk: '.voip-ptt',

}

const getDefaultTopic = (pushType: ApnsPushTypes) => {
  const defaultTopic = plugin.config.DEFAULT_TOPIC

  const suffix = topicSuffixes[pushType]

  return `${defaultTopic}${suffix}`
}

type ApnsPushTypes = 'alert' | 'background' | 'voip' | 'complication' | 'fileprovider' | 'mdm' | 'location' | 'liveactivity' | 'pushtotalk'

type HeaderOptions = {
  readonly 'apns-push-type'?: ApnsPushTypes,
  readonly 'apns-expiration'?: number,
  readonly 'apns-priority'?: number,
  readonly 'apns-topic'?: string,
  readonly 'apns-collapse-id'?: string,
}

const makeRequest = async (body: ApnsBody, pushToken: string, headerOptions?: HeaderOptions) => {
  const signedKey = await getBearerToken()

  const url = new URL(`https://api.development.push.apple.com/3/device/${pushToken}`)

  const client = http2.connect(url)

  const buffer = JSON.stringify(body)

  let rawBody = ''

  const headers = new Map<string, string | number>()

  const pushType = headerOptions?.['apns-push-type'] ?? 'alert',
        topic = headerOptions?.['apns-topic'] ?? getDefaultTopic(pushType)

  return new Promise<PushReturnType>((resolve, reject) => {
    client.on('error', (err) => {
      reject(err)
    })

    const req = client.request({
      ':path': url.pathname,
      ':authority': url.hostname,
      ':scheme': url.protocol,
      ':method': 'POST',
      'content-type': 'application/json',
      'content-length': buffer.length,
      'authorization': `bearer ${signedKey}`,
      // 'apns-collapse-id': headerOptions?.['apns-collapse-id'],
      'apns-push-type': pushType,
      'apns-expiration': headerOptions?.['apns-expiration'] ?? '0',
      'apns-priority': headerOptions?.['apns-priority'] ?? mapDefaultPriority[pushType],
      'apns-topic': topic,
    }, {
      endStream: false,
    })
      .setEncoding('utf8')
      .on('data', (chunk) => {
        rawBody += chunk
      })
      .on('end', () => {
        client.close()
        const statusCode = headers.get(':status') as number | undefined,
              apnsId = headers.get('apns-id') as string | undefined,
              apnsUniqueId = headers.get('apns-unique-id') as string | undefined

        try {
          const data = JSON.parse(rawBody)
          const reason = data.reason as APNSError['error']
          resolve({
            'rawBody': rawBody,
            'data': data,
            'rawHeaders': headers,
            'statusCode': statusCode,
            'failedReason': reason,
            'apns-id': apnsId,
            'apns-unique-id': apnsUniqueId,
          })
        } catch (e) {
          if (typeof statusCode === 'number') {
            resolve({
              'rawBody': rawBody,
              'rawHeaders': headers,
              'statusCode': statusCode,
              'apns-id': apnsId,
              'apns-unique-id': apnsUniqueId,
            })
          } else {
            reject(e)
          }
        }
      })
      .on('response', (h) => {
        // eslint-disable-next-line no-restricted-syntax, guard-for-in
        for (const name in h) {
          const value = h[name]
          if (typeof value === 'string' || typeof value === 'number') {
            headers.set(name, value)
          } else {
            plugin.providers.logger.warn('got non-string/number header', { name, value })
          }
        }
      })

    req.end(buffer, 'utf8', () => {
      // console.log('end-send')
    })
  })
}

function processPushResponses<TPush = PushTokenWithMetadata>(
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
    response: await makeRequest(body, pushToken.pushToken, {
      'apns-push-type': 'background',
    }),
    pushToken,
  })))

  const processed: ReturnType<SendSilentPushProvider> = processPushResponses(responses, data)

  return processed
}

interface ApnsBody {
  readonly [key: string]: JSON | Aps
  readonly aps: Aps
}

export const updateLiveActivity: SendUpdateLiveActivityPushProvider<Zemble.AppleUpdateLiveActivityPushTokenWithMetadata> = async (
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
    response: await makeRequest(body, pushToken.pushToken, {
      'apns-push-type': 'liveactivity',
    }),
    pushToken,
  })))

  const processed = processPushResponses(responses, liveActivity)

  return processed
}

export const startLiveActivity: SendStartLiveActivityPushProvider<Zemble.AppleStartLiveActivityPushTokenWithMetadata> = async (pushTokens, liveActivity) => {
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
    response: await makeRequest(body, pushToken.pushToken, {
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
    response: await makeRequest(body, pushToken.pushToken),
    pushToken,
  })))

  const processed = processPushResponses(responses, message)

  return processed
}

const defaultConfig: ApplePushOptions = {
  APPLE_TEAM_ID: process.env['APPLE_TEAM_ID'],
  APPLE_KEY_ID: process.env['APPLE_KEY_ID'],
  APPLE_PATH_TO_P8_KEY: process.env['APPLE_PATH_TO_P8_KEY'],
  APPLE_P8_KEY: process.env['APPLE_P8_KEY'],
  DEFAULT_TOPIC: process.env['DEFAULT_TOPIC'],
  persistPushToken: async (_, pushTokenInfo) => {
    plugin.providers.logger.error('[@zemble/push-apple] persistPushToken not configured', pushTokenInfo)
  },
}

const plugin = new Plugin<ApplePushOptions, typeof defaultConfig>(
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
