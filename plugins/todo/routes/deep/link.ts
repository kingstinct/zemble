import type { Context } from 'hono'

export default ({req, text}: Context) => {
  console.log('req?', req);
  return text('hello world hey with query ' + JSON.stringify(req.query()))
} 