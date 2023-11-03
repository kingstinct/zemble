/* eslint-disable camelcase */

import { createSupabaseServerClient } from '../../clients/supabase'

// this flow has not been tested:
// https://supabase.com/docs/guides/auth/server-side/email-based-auth-with-pkce-flow-for-ssr

export const get = async function confirm(ctx: Zemble.RouteContext) {
  const { type, token_hash } = ctx.req.query()
  const next = ctx.req.query('next') ?? '/'

  if (token_hash && type) {
    const { error } = await createSupabaseServerClient().auth.verifyOtp({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      type,
      token_hash,
    })
    if (!error) {
      ctx.redirect(`/${next.slice(1)}`, 303)
    }
  }

  // return the user to an error page with some instructions
  ctx.redirect('/auth/auth-code-error', 303)
}
