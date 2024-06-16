import * as jose from 'jose'

import { readP8KeyStringOrFile } from './clients/apns'
import plugin from './plugin'

import type { ApnsPushTypes } from './clients/apns'

export const mapDefaultPriority: Record<ApnsPushTypes, number> = {
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

export const topicSuffixes: Record<ApnsPushTypes, string> = {
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

export const getDefaultTopic = (pushType: ApnsPushTypes) => {
  const defaultTopic = plugin.config.DEFAULT_TOPIC

  const suffix = topicSuffixes[pushType]

  return `${defaultTopic}${suffix}`
}

export const convertDateToSecondsSinceEpoch = (date: Date) => Math.round(date.getTime() / 1000)

export const getBearerToken = async () => {
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
