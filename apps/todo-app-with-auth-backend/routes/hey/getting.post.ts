import type { Context } from 'hono'

const getter = async (c: Context) =>
  c.html(`<html>
    <head>
      <title>yeah it's a get</title>
      <meta name="color-scheme" content="light dark">
    </head>
    <body>
      <div>
        <p>Hello Zemble! Serving</p>
        <p><a href='/graphql'>Check out your GraphQL API here</a></p>
      </div>
    </body>
  </html>`)

export default getter
