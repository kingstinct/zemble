import { deleteCookie } from 'hono/cookie'
import Auth from 'zemble-plugin-auth'

import type { MutationResolvers } from '../schema.generated'
import type { Context } from 'hono'

const logout: MutationResolvers['logout'] = async (_, __, { honoContext }) => {
  if (Auth.config.cookies.isEnabled) {
    deleteCookie(honoContext as Context, Auth.config.cookies.name, Auth.config.cookies.opts())
  }

  return { success: true, __typename: 'LoginRequestSuccessResponse' }
}

export default logout
