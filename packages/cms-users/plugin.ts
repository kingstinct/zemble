/* eslint-disable react-hooks/rules-of-hooks */
import { Plugin } from '@zemble/core'
import mongodb from '@zemble/mongodb'
import authOtp from 'zemble-plugin-auth-otp'
import cms from 'zemble-plugin-cms'
import papr from 'zemble-plugin-cms/clients/papr'

import { PermissionType, User, connect } from './clients/papr'

import type { DependenciesResolver } from '@zemble/core'

interface CmsConfig extends Zemble.GlobalConfig {

}

const defaultConfig = {

} satisfies CmsConfig

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface OtpToken {
      readonly id: string
      readonly type: 'cms-user'
      readonly email: string,
      readonly permissions: readonly {
        readonly type: PermissionType,
        readonly scope: string,
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
          plugin: authOtp.configure({
            from: {
              email: 'noreply@cmsexample.com',
            },
            generateTokenContents: async (emailIn) => {
              const email = emailIn.trim().toLowerCase()

              const user = await User.findOneAndUpdate({
                email,
              }, {
                $setOnInsert: {
                  email,
                  permissions: await isFirstUser() ? [
                    { type: PermissionType.MODIFY_ENTITY, scope: '*' },
                    { type: PermissionType.USER_ADMIN, scope: '*' },
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
