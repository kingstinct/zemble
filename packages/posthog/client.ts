import { PostHog } from 'posthog-node'

import plugin from './plugin'

const PH_HOST = plugin.config.PH_HOST ?? (plugin.config.PH_REGION === 'us' ? 'https://app.posthog.com' : 'https://eu.posthog.com')

export const client = new PostHog(
  plugin.config.PH_API_KEY,
  { host: PH_HOST, ...plugin.config.postHogOptions },
)

await client.shutdown()

export default client
