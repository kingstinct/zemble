
import { Context } from 'hono'


export default ({ json }: Context) => json({
  "applinks": {
      "apps": [],
      "details": [
          {
              "appID": "9JA89QQLNQ.com.apple.wwdc",
              "paths": [ "/wwdc/news/", "/videos/wwdc/2015/*"]
          },
          {
              "appID": "ABCD1234.com.apple.wwdc",
              "paths": [ "*" ]
          }
      ]
  }
})