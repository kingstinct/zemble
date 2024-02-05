# @zemble/react

[![npm (scoped)](https://img.shields.io/npm/v/@zemble/react?style=for-the-badge)](https://www.npmjs.com/package/@zemble/react)

This is a utility library for React that we use across our projects at Kingstinct (still early days for this lib).

To import a utility the best is to import it directly:
`import useEvent from '@zemble/react/hooks/useEvent'`

You can also use named imports, but if you're not having all dependencies installed you'll probably run into errors:
`import { useEvent } from '@zemble/react'`

The goal of this library (and the related [@zemble/utils](https://github.com/Kingstinct/utils)) is to:
- Keep the number of dependencies in projects down
- Have a common place to put useful utilities, so they're easier to maintain and find
- Quickly get up and running with new projects

We believe this is a better approach than the alternatives:
- Using one single utility library for everything, which would introduce unnecessary dependencies
- Using lots of micro-libs. Micro-libs does have it's advantages, but is harder to maintain and means loosing oversight of the dependencies in a project.
- Copy pasting between projects :)
 
# Storybooks and Expo
Currently the Storybooks implementation works for web and the example-app works with Expo for mobile.
