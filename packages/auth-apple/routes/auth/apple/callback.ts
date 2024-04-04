import plugin from '../../../plugin'
import { generateAccessTokenFromAppleToken, type AppleUserSignupData, type AppleUserSignupDataOnWeb } from '../../../utils/generateToken'
import { validateIdToken } from '../../../utils/validateIdToken'
import { validateOAuthStateJWT } from '../../../utils/validateOAuthStateJWT'

import type { Context } from 'hono'

const REDIRECT_ON_ERROR = '/login'
const REDIRECT_ON_SUCCESS = '/'

export default async (ctx: Context) => {
  const formData = await ctx.req.formData()

  const idToken = formData.get('id_token')?.toString()

  const user = formData.get('user')?.toString()

  const state = formData.get('state')?.toString()

  if (state) {
    const isValid = await validateOAuthStateJWT(state)
    if (!isValid) {
      plugin.providers.logger.error('state is invalid or expired')
      return ctx.redirect(REDIRECT_ON_ERROR)
    }
  }

  if (!idToken) {
    plugin.providers.logger.error('No id_token found in formdata from Apple')
    return ctx.redirect(REDIRECT_ON_ERROR)
  }

  try {
    const decoded = await validateIdToken(idToken)
    const userDataOnWeb = user ? JSON.parse(user) as AppleUserSignupDataOnWeb : undefined
    const userData: AppleUserSignupData | undefined = userDataOnWeb ? {
      email: userDataOnWeb.email,
      name: userDataOnWeb.name ? {
        givenName: userDataOnWeb.name.firstName,
        familyName: userDataOnWeb.name.lastName,
      } : undefined,
    } : undefined

    const token = await generateAccessTokenFromAppleToken(decoded, userData)

    // handle token

    // Code to handle user authentication and retrieval using the decoded information

    return ctx.redirect(`${REDIRECT_ON_SUCCESS}?zembleAuthToken=${token}`)
  } catch (error) {
    if (error instanceof Error) {
      plugin.providers.logger.error('Error:', error.message)
    } else {
      plugin.providers.logger.error('Error:', error)
    }

    return ctx.redirect(REDIRECT_ON_ERROR)
  }
}
