# Zemble

This is a monorepo with apps/* for apps and packages/* for packages. It's a mix of Expo apps, React Native apps, and some Node.js packages. The monorepo is designed to be used with Bun as the package manager and build tool.

It's main purpose is to make it easy to publish utils and plugins we can reuse across our apps in other repos.

## Key Libraries & Documentation
- [Jotai](https://jotai.org) - Atomic state management for React
- [Expo Router](https://docs.expo.dev/router/introduction/) - File-based navigation

## Common processes and workflows

### Typechecking, linting, and codegen
The following can usually be run on either the root level (using turborepo) or in the individual packages.

#### lint
Generally run it from the root of the monorepo:
```bash
bun run lint
```

#### typecheck
Generally run it from the root of the monorepo:
```bash
bun run typecheck
```

#### codegen
Run this to generate types for GraphQL queries and mutations:
```bash
bun run codegen
```

### Upgrade packages - including Expo and native
Do this for all projects that contains expo as a dependency in package.json, when asked to upgrade Expo and native dependencies.

I usually go about it like this:
1. Upgrade expo to it's latest version in package.json and run `bunx expo install --fix`. Do this for all projects.
2. Make sure everything works (lint, types) - and commit
3. Upgrade all other minor versions, which is usually safe (`bun update` should do this I think)
4. Make sure everything works (lint, types, run a native build with `bunx expo run:ios` and `bunx expo run:android`) - and commit once it all passes (with --amend to keep it to one single commit)
5. Run `bun outdated` and take a stab at the remaining majors (often I just try upgrading everything at this stage initially). For any easy to fix errors, try fixing them, but don't spend too much time on it, be prepared to roll back bigger changes.
6. Being prepared to roll back to the stable commit - and skip packages that require more effort - iterating until we have most packages at the latest

## Definition of Done
IMPORTANT: This goes for any task!

ALWAYS run lint and typechecking after making any change. These are fast enough to make sense at the end of any task.