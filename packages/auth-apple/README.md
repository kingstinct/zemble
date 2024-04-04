# @zemble/auth-apple

This plugin handles authentication with Apple's Sign In with Apple service. It's primary purpose is to get a verified email address from Apple's service at a single point in time. It supports both iOS and OAuth flows for other platforms.

Endpoints for OAuth flow (defaults to):
- `/auth/apple` - Redirects automatically to Apple's login page
- `/auth/apple/callback` - Handles the callback from Apple's login page - will forward the user to the `redirect_uri` specified in the query parameters

The callback URL needs to be configured with Apple.