import { getRedirectUrl } from './addRedirectToAppRoutes'

const BASE_URL = 'https://my-awesome-api.com'

describe('googleFitOAuthUrl', () => {
  test('should get app redirect URL for app scheme', () => {
    const appScheme = 'an-app-scheme'
    const redirectUrl = getRedirectUrl(BASE_URL, appScheme)

    expect(redirectUrl).toEqual(`${BASE_URL}/redirect-to-app/${appScheme}`)
  })

  test('should not break on app scheme with protocol', () => {
    const appScheme = 'an-app-scheme'
    const appSchemeWithProtocol = `${appScheme}://`
    const redirectUrl = getRedirectUrl(BASE_URL, appSchemeWithProtocol)

    expect(redirectUrl).toEqual(`${BASE_URL}/redirect-to-app/${appScheme}`)
  })

  test('should get app redirect URL for app scheme with path', () => {
    const path = 'a-path'
    const appScheme = 'an-app-scheme'
    const appSchemeWithPath = `${appScheme}://${path}`
    const redirectUrl = getRedirectUrl(BASE_URL, appSchemeWithPath)

    expect(redirectUrl).toEqual(`${BASE_URL}/redirect-to-app/${appScheme}/${path}`)
  })

  test('should just return redirect url for non-app URL', () => {
    const actualUrl = 'https://an-ordinary-url.com/my-redirect'
    const redirectUrl = getRedirectUrl(BASE_URL, actualUrl)

    expect(redirectUrl).toEqual(actualUrl)
  })
})
