import { kv } from 'zemble-plugin-kv'

export const loginRequestKeyValue = kv<{ readonly loginRequestedAt: string, readonly twoFactorCode: string }>('loginRequests')
