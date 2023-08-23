import initialize from "@readapt/core"

import AppleAppSiteAssociation from "readapt-plugin-apple-app-site-association"
import AnonymousAuth from "readapt-plugin-anonymous-auth"
import TodoPlugin from "readapt-plugin-todo"
import YogaGraphQL from "@readapt/graphql-yoga"

initialize([
  AnonymousAuth.init({ }),
  YogaGraphQL.init({
    plugins: [
      
    ]
   }),
  TodoPlugin.init({ }),
  AppleAppSiteAssociation.init({
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
])