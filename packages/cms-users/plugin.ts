import authOtp from '@zemble/auth-otp'
import cms from '@zemble/cms'
import papr from '@zemble/cms/clients/papr'
import { Plugin } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import mongodb from '@zemble/mongodb'

import { PermissionType, User, connect } from './clients/papr'

import type { DependenciesResolver, BaseToken } from '@zemble/core'

interface CmsConfig extends Zemble.GlobalConfig {

}

const defaultConfig = {

} satisfies CmsConfig

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface OtpToken extends BaseToken {
      readonly id: string
      readonly type: 'cms-user' | 'AuthOtp',
      readonly email?: string,
      readonly permissions: readonly {
        readonly type: PermissionType,
      }[]
    }
  }
}

let isFirstUserInternal: boolean | null = null

const isFirstUser = async (): Promise<boolean> => {
  if (isFirstUserInternal === null) {
    const userCount = await User.countDocuments({})
    const isFirst = userCount === 0
    isFirstUserInternal = false
    return isFirst
  }
  return isFirstUserInternal
}

const plugin = new Plugin(import.meta.dir,
  {
    middleware: async ({ logger }) => {
      await Promise.all([connect({ logger }), papr.connect({ logger })])
    },
    dependencies: () => {
      const deps: DependenciesResolver<Plugin> = [
        {
          plugin: mongodb,
        },
        {
          plugin: cms,
        },
        {
          plugin: GraphQL,
        },
        {
          plugin: authOtp.configure({
            fromEmail: {
              email: 'noreply@cmsexample.com',
            },
            generateTokenContents: async ({ email }) => {
              if (!email) {
                throw new Error('Email is required')
              }
              const user = await User.findOneAndUpdate({
                email,
              }, {
                $setOnInsert: {
                  email,
                  permissions: await isFirstUser() ? [
                    { type: PermissionType.DEVELOPER },
                    { type: PermissionType.MANAGE_USERS },
                  ] : [],
                },
                $set: {
                  lastLoginAt: new Date(),
                },
              }, {
                returnDocument: 'after',
                upsert: true,
              })

              return {
                email: user!.email,
                id: user!._id.toHexString(),
                type: 'cms-user',
                permissions: user!.permissions,
                sub: user!._id.toHexString(),
              }
            },
          }),
        },
      ]

      return deps
    },
    defaultConfig,
  })

export default plugin
