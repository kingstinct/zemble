import plugin from '../plugin'

export const loginRequestKeyValue = plugin.providers.kv<{ readonly loginRequestedAt: string, readonly twoFactorCode: string }>('loginRequests')
