import { createApp } from '@zemble/core'
import YogaGraphQL from '@zemble/graphql'
import AppleAppSiteAssociation from 'zemble-plugin-apple-app-site-association'
import AnonymousAuth from 'zemble-plugin-auth-anonymous'
import Bull from 'zemble-plugin-bull'
import TodoPlugin from 'zemble-plugin-todo'

const app = createApp({
  plugins: [
    YogaGraphQL.configure({
      yoga: {
        graphqlEndpoint: '/graphql',
        plugins: [],
      },
    }),
    Bull.configure(),
    AnonymousAuth.configure(),
    TodoPlugin.configure(),
    AppleAppSiteAssociation.configure({
      applinks: {
        apps: [],
        details: [
          {
            appID: '9JA89QQLNQ.com.example.app',
            paths: ['/api/*'],
          },
        ],
      },
    }),
  ],
})

void app.then(({ start }) => start())
