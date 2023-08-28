import RedisKeyValue from '../utils/RedisKeyValue'

export const loginRequestKeyValue = new RedisKeyValue<{ readonly loginRequestedAt: Date, readonly twoFactorCode: string }>('loginRequests')
