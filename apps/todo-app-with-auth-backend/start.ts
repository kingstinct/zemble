import configure from "@readapt/core"

import AppleAppSiteAssociation from "readapt-plugin-apple-app-site-association"
import AnonymousAuth from "readapt-plugin-anonymous-auth"
import TodoPlugin from "readapt-plugin-todo"
import Bull from "readapt-plugin-bull"
import YogaGraphQL from "@readapt/graphql-yoga"

configure({
  middleware: [
    YogaGraphQL.configureMiddleware({
      yoga: {
        graphqlEndpoint: '/public',
        plugins: [
        
      ]
    }
  }),
  ],
  plugins: [
    AnonymousAuth.configurePlugin(),
    
    TodoPlugin.configurePlugin(),
    Bull.configurePlugin(),
    AppleAppSiteAssociation.configurePlugin({
        applinks: {
          apps: [],
          details: [
            {
              appID: "9JA89QQLNQ.com.example.app",
              paths: ["/api/*"],
            },
          ],
        },
    }),
  ]
})


/*

import { baseConfiguration } from "@readapt/core/base"
import { barebones } from "@readapt/core/barebones"

const baseConfiguration = configure({
  middleware: [
    YogaGraphQL.config({
      yoga: {
        graphqlEndpoint: '/public',
        plugins: []
      }
    }),
    YogaGraphQL.config({
      yoga: {
        graphqlEndpoint: '/private',
        plugins: []
      }
    }),
  ],
})


const server = configure({
  middleware: [
    Bull.config({ }),
  ],
  plugins: [
    AnonymousAuth.config({ }),
    TodoPlugin.config({ }),
    AppleAppSiteAssociation.config({
        applinks: {
          apps: [],
          details: [
            {
              appID: "9JA89QQLNQ.com.example.app",
              paths: ["/api/*"],
            },
          ],
        },
    }),
  ],
  inherits: [baseConfiguration]
})

server.start()
*/