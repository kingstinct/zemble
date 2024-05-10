import plugin from '../../plugin'

export default async (ctx: Zemble.RouteContext) => {
  try {
    const pong = await plugin.providers.mongodb?.db.command({ ping: 1 })
    if (pong?.['ok'] === 1) {
      return ctx.json({ status: 'ok' }, 200)
    }
    return ctx.json({ status: 'error', message: 'ping failed' }, 503)
  } catch (error) {
    if (error instanceof Error) {
      return ctx.json({ status: 'error', message: error?.message }, 503)
    }
    return ctx.json({ status: 'error' }, 503)
  }
}
