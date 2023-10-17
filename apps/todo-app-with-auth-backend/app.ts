import bunRunner from '@zemble/bun'
import Ignite from '@zemble/ignite'
import AppleAppSiteAssociation from 'zemble-plugin-apple-app-site-association'
import AnonymousAuth from 'zemble-plugin-auth-anonymous'
import TodoPlugin from 'zemble-plugin-todo'

void bunRunner({
  plugins: [
    Ignite.configure(),
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
