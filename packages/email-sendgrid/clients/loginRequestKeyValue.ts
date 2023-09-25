import { kv } from 'readapt-plugin-kv'

export const loginRequestKeyValue = kv<{ readonly loginRequestedAt: string, readonly twoFactorCode: string }>('loginRequests')
