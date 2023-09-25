import type { Context } from 'hono'

export default ({ req, text }: Context) => text(`hello world hey with query ${JSON.stringify(req.query())}`)
