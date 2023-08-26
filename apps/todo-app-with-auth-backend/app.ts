import configure from '@readapt/core'
import YogaGraphQL from '@readapt/graphql-yoga'
import AnonymousAuth from 'readapt-plugin-anonymous-auth'
import AppleAppSiteAssociation from 'readapt-plugin-apple-app-site-association'
import Bull from 'readapt-plugin-bull'
import TodoPlugin from 'readapt-plugin-todo'

const app = configure({
  middleware: [
    YogaGraphQL.configureMiddleware({
      yoga: {
        graphqlEndpoint: '/graphql',
        plugins: [],
      },
    }),
    Bull.configureMiddleware(),
  ],
  plugins: [
    AnonymousAuth.configurePlugin(),
    TodoPlugin.configurePlugin(),
    AppleAppSiteAssociation.configurePlugin({
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

void app.start()
