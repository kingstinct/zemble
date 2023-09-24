import { createApp } from '@readapt/core'
import YogaGraphQL from '@readapt/graphql-yoga'
import AppleAppSiteAssociation from 'readapt-plugin-apple-app-site-association'
import AnonymousAuth from 'readapt-plugin-auth-anonymous'
import Bull from 'readapt-plugin-bull'
import TodoPlugin from 'readapt-plugin-todo'

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
