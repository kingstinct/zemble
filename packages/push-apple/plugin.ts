import {
  Plugin,
  type SendPushProvider,
  type PushMessage,
  type PushTokenWithMetadata,
  type SendSilentPushProvider,
} from '@zemble/core'
import GraphQL from '@zemble/graphql'
import * as jose from 'jose'
import http2 from 'node:http2'

import { readP8KeyStringOrFile } from './clients/apns'

import type { APNSError, Aps } from './types'

interface ApplePushOptions extends Zemble.GlobalConfig {
  readonly APPLE_TEAM_ID?: string
  readonly APPLE_KEY_ID?: string
  readonly APPLE_PATH_TO_P8_KEY?: string
  readonly APPLE_P8_KEY?: string
  readonly DEFAULT_TOPIC?: string
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface Providers {
      readonly sendPush: SendPushProvider
    }

    type ApplePushTokenWithMetadata = {
      readonly type: 'APPLE',
      readonly platforms: readonly ('ios')[]
      readonly createdAt: Date
      readonly pushToken: string
    }

    interface PushTokenRegistry {
      readonly apple: ApplePushTokenWithMetadata
    }

    interface MiddlewareConfig {
      readonly ['@zemble/push-apple']?: undefined
    }
  }
}

const convertNowPlusSecondsToDate = (seconds: number) => {
  const now = new Date()
  now.setSeconds(now.getSeconds() + seconds)

  return now
}

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

const makeRequest = async (aps: Aps, pushToken: string, headerOptions?: HeaderOptions) => {
  const signedKey = await getBearerToken()

  const url = new URL(`https://api.development.push.apple.com/3/device/${pushToken}`)

  const client = http2.connect(url)

  const body = { aps }

  const buffer = JSON.stringify(body)

  let d = ''

  const headers = new Map<string, string | number>()

  const pushType = headerOptions?.['apns-push-type'] ?? 'alert'

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
      'apns-collapse-id': headerOptions?.['apns-collapse-id'],
      'authorization': `bearer ${signedKey}`,
      'apns-push-type': pushType,
      'apns-expiration': headerOptions?.['apns-expiration'] ?? '0',
      'apns-priority': headerOptions?.['apns-priority'] ?? mapDefaultPriority[pushType],
      'apns-topic': headerOptions?.['apns-topic'] ?? getDefaultTopic(pushType),
    }, {
      endStream: false,
    })
      .setEncoding('utf8')
      .on('data', (chunk) => {
        d += chunk
      })
      .on('end', () => {
        client.close()
        const statusCode = headers.get(':status') as number | undefined,
              apnsId = headers.get('apns-id') as string | undefined,
              apnsUniqueId = headers.get('apns-unique-id') as string | undefined

        try {
          const data = JSON.parse(d)
          const reason = data.reason as APNSError['error']
          resolve({
            'rawBody': d, data, 'rawHeaders': headers, statusCode, 'failedReason': reason, 'apns-id': apnsId, 'apns-unique-id': apnsUniqueId,
          })
        } catch (e) {
          if (typeof statusCode === 'number') {
            resolve({
              'rawBody': d, 'rawHeaders': headers, statusCode, 'apns-id': apnsId, 'apns-unique-id': apnsUniqueId,
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
            console.warn('got non-string/number header', { name, value })
          }
        }
      })

    req.end(buffer, 'utf8', () => {
      // console.log('end-send')
    })
  })
}

const processPushResponses = (responses: readonly { readonly response: PushReturnType, readonly pushToken: PushTokenWithMetadata }[], message: PushMessage) => {
  const successfulSends = responses.filter(({ response }) => response.statusCode === 200).map(({ response, pushToken }) => ({
    message,
    ticketId: response['apns-unique-id']!,
    pushToken,
  }))

  const failedSendsToRemoveTokensFor = responses.filter(({ response }) => response.statusCode === 410).map(({ pushToken }) => pushToken)

  const failedSendsOthers = responses.filter(({ response }) => response.statusCode !== 200 && response.statusCode !== 410).map(({ pushToken, response }) => ({
    failedReason: response.failedReason!,
    message,
    pushToken,
  }))

  return {
    failedSendsOthers,
    failedSendsToRemoveTokensFor,
    successfulSends,
  }
}

export const sendSilentPush: SendSilentPushProvider = async (pushTokens: readonly Zemble.PushTokenRegistry['apple'][], data: Record<string, unknown>) => {
  const body: Aps = {
    'content-available': 1 as const,
  }

  const responses = await Promise.all(pushTokens.map(async (pushToken) => ({
    response: await makeRequest(body, pushToken.pushToken, {
      'apns-push-type': 'background',
    }),
    pushToken,
  })))

  const processed = processPushResponses(responses, {
    data,
    mutableContent: false,
  })

  return processed
}

export const sendPush: SendPushProvider = async (pushTokens: readonly Zemble.PushTokenRegistry['apple'][], message: PushMessage) => {
  const body = {
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
  } satisfies Aps

  const responses = await Promise.all(pushTokens.map(async (pushToken) => ({
    response: await makeRequest(body, pushToken.pushToken),
    pushToken,
  })))

  console.log('responses', responses)

  const processed = processPushResponses(responses, message)

  console.log('processed', processed)

  return processed
}

// working but bläh
// export const sendPush: SendPushProvider = async (pushTokens: readonly Zemble.PushTokenRegistry['apple'][], message:
// PushMessage) => {
//   const options = {
//     token: {
//       key: await readP8KeyStringOrFile(),
//       keyId: plugin.config.APPLE_KEY_ID!,
//       teamId: plugin.config.APPLE_TEAM_ID!,
//     },
//     production: false,
//   }

//   const apnProvider = new apn.Provider(options)

//   const notification = new apn.Notification({
//     alert: message.body!,
//     badge: message.badge!,
//     category: message.categoryId!,
//     mutableContent: message.mutableContent!,
//     expiry: message.ttl!,
//     payload: message.data!,
//   })
//   // eslint-disable-next-line functional/immutable-data
//   notification.topic = plugin.config.DEFAULT_TOPIC!

//   const res = await apnProvider.send(notification, pushTokens.map((token) => token.pushToken))

//   console.log('res', res)

//   return {
//     failedSendsToRemoveTokensFor: [],
//     failedSendsOthers: [],
//     successfulSends: [],
//   }
// }

// const sendPushNative = async (pushTokens: Zemble.PushTokenRegistry['apple'][], message: PushMessage) => {
//   const apns = await createClient()

//   await apns.sendMany(pushTokens.map((token) => new Notification(token.pushToken, {
//     alert: message.body,
//     badge: message.badge,
//     category: message.categoryId,
//     mutableContent: message.mutableContent,
//     data: message.data,
//     expiration: message.ttl ? convertNowPlusSecondsToDate(message.ttl) : undefined,
//     priority: mapPriority(message.priority),
//     type: PushType.alert,
//   })))

//   return {
//     failedSendsToRemoveTokensFor: [],
//     failedSendsOthers: [],
//     successfulSends: [],
//   }
// }

const defaultConfig: ApplePushOptions = {
  APPLE_TEAM_ID: process.env['APPLE_TEAM_ID'],
  APPLE_KEY_ID: process.env['APPLE_KEY_ID'],
  APPLE_PATH_TO_P8_KEY: process.env['APPLE_PATH_TO_P8_KEY'],
  APPLE_P8_KEY: process.env['APPLE_P8_KEY'],
  DEFAULT_TOPIC: process.env['DEFAULT_TOPIC'],
}

const plugin = new Plugin<ApplePushOptions, typeof defaultConfig>(
  import.meta.dir,
  {
    dependencies: [{ plugin: GraphQL }],
    defaultConfig,
  },
)

export default plugin
