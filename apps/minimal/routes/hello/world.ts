const route = (ctx: Zemble.RouteContext) =>
  ctx.json({
    hello: 'world',
  })

export default route
