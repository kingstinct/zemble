import type { ApplePushPlatform, MutationAppleLiveActivityStateUpdatedArgs } from './graphql/schema.generated'
import type { AnyPushTokenWithMetadata, PushTokenWithContentsAndFailedReason, TokenContents } from '@zemble/core'

export interface ApplePushOptions extends Zemble.GlobalConfig {
  readonly APPLE_TEAM_ID?: string
  readonly APPLE_KEY_ID?: string
  readonly APPLE_PATH_TO_P8_KEY?: string
  readonly APPLE_P8_KEY?: string
  readonly DEFAULT_TOPIC?: string
  readonly persistPushToken: (
    decodedToken: TokenContents,
    pushTokenWithMetadata: AnyPushTokenWithMetadata,
  ) => Promise<void>
  readonly handleExpiredPushTokens: (
    pushTokenWithMetadata: readonly AnyPushTokenWithMetadata[],
  ) => Promise<void>
  readonly handlePushTokenErrors?: (
    pushTokenWithMetadata: readonly PushTokenWithContentsAndFailedReason<AnyPushTokenWithMetadata>[],
  ) => Promise<void>
  readonly handleLiveActivityStateChange?: (
    args: MutationAppleLiveActivityStateUpdatedArgs,
    context: Zemble.GraphQLContext,
  ) => Promise<void>
}

export type ApplePushTokenWithMetadata = {
  readonly type: 'APPLE',
  readonly platform: ApplePushPlatform
  readonly pushToken: string
  readonly appBundleId: string
  readonly isSandbox?: boolean
}

export type AppleStartLiveActivityPushTokenWithMetadata = {
  readonly type: 'APPLE_START_LIVE_ACTIVITY',
  readonly platform: ApplePushPlatform
  readonly pushToken: string
  readonly appBundleId: string
  readonly isSandbox?: boolean
}

export type AppleUpdateLiveActivityPushTokenWithMetadata = {
  readonly type: 'APPLE_UPDATE_LIVE_ACTIVITY',
  readonly platform: ApplePushPlatform
  readonly pushToken: string
  readonly appBundleId: string
  readonly isSandbox?: boolean
}
