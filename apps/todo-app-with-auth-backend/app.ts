import { createApp } from '@readapt/core'
import YogaGraphQL from '@readapt/graphql-yoga'
import AnonymousAuth from 'readapt-plugin-anonymous-auth'
import AppleAppSiteAssociation from 'readapt-plugin-apple-app-site-association'
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

  ],
})

void app.then(({ start }) => start())
