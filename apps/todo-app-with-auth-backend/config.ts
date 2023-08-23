import initialize from "@readapt/core"

import AppleAppSiteAssociation from "readapt-plugin-apple-app-site-association"
import AnonymousAuth from "readapt-plugin-anonymous-auth"
import TodoPlugin from "readapt-plugin-todo"

initialize([
  AnonymousAuth.init({ }),
  TodoPlugin({ }),
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