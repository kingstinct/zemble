import type { SupabaseClient, User } from '@supabase/supabase-js'
import Auth from '@zemble/auth'
import { Plugin } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import Routes from '@zemble/routes'
import { createSupabaseServerClient } from './clients/createSupabaseServerClient'
import { decodeToken } from './decodeToken'

interface SupabaseConfig extends Zemble.GlobalConfig {
  readonly supabaseUrl?: string
  readonly supabaseAnonKey?: string
}

const defaultConfig = {
  supabaseUrl: process.env['SUPABASE_URL'],
  supabaseAnonKey: process.env['SUPABASE_ANON_KEY'],
}

declare global {
  namespace Zemble {
    interface TokenRegistry {
      readonly SupabaseToken: User
    }

    interface Providers {
      supabaseServerClient: SupabaseClient
    }
  }
}

const plugin = new Plugin<SupabaseConfig, typeof defaultConfig>(
  import.meta.dir,
  {
    middleware: ({ app }) => {
      app.providers.supabaseServerClient = createSupabaseServerClient()
    },
    dependencies: [
      { plugin: GraphQL },
      { plugin: Routes },
      {
        plugin: Auth.configure({
          decodeToken,
        }),
      },
    ],
    defaultConfig,
  },
)

export default plugin
