/* eslint-disable react-hooks/rules-of-hooks */
import { Plugin } from '@readapt/core'
import authOtp from 'readapt-plugin-auth-otp'
import cms from 'readapt-plugin-cms'

import { PermissionType, User, connect } from './clients/papr'

import type { DependenciesResolver } from '@readapt/core'

interface CmsConfig extends Readapt.GlobalConfig {

}

const defaultConfig = {

} satisfies CmsConfig

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Readapt {
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

const plugin = new Plugin(__dirname, {
  dependencies: () => {
    const deps: DependenciesResolver<readonly Readapt.GlobalConfig[]> = [
      {
        plugin: cms,
      },
      {
        plugin: authOtp.configure({
          from: { email: 'noreply@cmsexample.com' },
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

if (process.env.PLUGIN_DEV) {
  void connect()
}

export default plugin
