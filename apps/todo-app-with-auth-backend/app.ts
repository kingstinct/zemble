import AppleAppSiteAssociation from '@zemble/apple-app-site-association'
import AnonymousAuth from '@zemble/auth-anonymous'
import bunRunner from '@zemble/bun'
import Ignite from '@zemble/ignite'
import TodoPlugin from '@zemble/todo'

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
