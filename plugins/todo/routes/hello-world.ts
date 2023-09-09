import type { Context } from 'hono'

export default ({ req, text, env }: Context) => {
  env
  console.log('req?', req)
  return text(`hello world hey with query ${JSON.stringify(req.query())}`)
}
