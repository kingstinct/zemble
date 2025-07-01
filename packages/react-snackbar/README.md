# @zemble/react-snackbar

[![npm (scoped)](https://img.shields.io/npm/v/@zemble/react-snackbar?style=for-the-badge)](https://www.npmjs.com/package/@zemble/react-snackbar)

React Snackbar components and hooks for the Zemble ecosystem. This package provides a complete snackbar system with customizable components, hooks, and state management.

## Installation

```bash
npm install @zemble/react-snackbar
# or
yarn add @zemble/react-snackbar
# or
bun add @zemble/react-snackbar
```

## Usage

### Basic Setup

First, add the `SnackbarPresentationView` to your app where you want snackbars to appear:

```tsx
import React from 'react'
import { View } from 'react-native'
import { SnackbarPresentationView } from '@zemble/react-snackbar'

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      {/* Your app content */}
      
      {/* Place this where you want snackbars to appear */}
      <SnackbarPresentationView />
    </View>
  )
}
```

### Showing Snackbars

Use the `useAddSnackbar` hook to show snackbars:

```tsx
import React from 'react'
import { Button } from 'react-native'
import { useAddSnackbar } from '@zemble/react-snackbar'

export function MyComponent() {
  const addSnackbar = useAddSnackbar()

  const showSnackbar = () => {
    addSnackbar('Hello, this is a snackbar!')
  }

  return <Button title="Show Snackbar" onPress={showSnackbar} />
}
```

### Snackbars with Actions

```tsx
import { useAddSnackbar } from '@zemble/react-snackbar'

const addSnackbar = useAddSnackbar()

addSnackbar('Do you want to continue?', {
  actions: [
    {
      label: 'Yes',
      onPress: () => console.log('User said yes'),
    },
    {
      label: 'No',
      onPress: () => console.log('User said no'),
    },
  ],
})
```

### Custom Timeout

```tsx
addSnackbar('This will disappear after 10 seconds', {
  timeout: 10000, // 10 seconds
})
```

## API Reference

### Components

- **`SnackbarPresentationView`** - The container that renders snackbars
- **`DefaultSnackbarComponent`** - The default snackbar component (customizable)

### Hooks

- **`useAddSnackbar()`** - Add a new snackbar
- **`useRemoveSnackbar()`** - Remove a snackbar by ID
- **`useSnackbarsToShow()`** - Get currently visible snackbars
- **`useSnackbarSettings()`** - Configure global snackbar settings
- **`useSnackbarWasPresented()`** - Mark a snackbar as presented

### Types

- **`SnackbarConfig`** - Configuration for a snackbar
- **`Action`** - Action button configuration
- **`SnackbarComponentProps`** - Props for custom snackbar components

## Customization

You can provide a custom component to `SnackbarPresentationView`:

```tsx
import { SnackbarPresentationView, DefaultSnackbarComponent } from '@zemble/react-snackbar'

const CustomSnackbar = (props) => (
  <DefaultSnackbarComponent
    {...props}
    style={{ backgroundColor: 'red' }}
    textColor="white"
  />
)

<SnackbarPresentationView Component={CustomSnackbar} />
```

## Configuration

Configure global settings:

```tsx
import { useSnackbarSettings } from '@zemble/react-snackbar'

function App() {
  useSnackbarSettings({
    defaultTimeoutMs: 8000, // 8 seconds
    snackbarsToShowAtSameTime: 3, // Show up to 3 snackbars at once
  })

  return <YourApp />
}
```

## Migration from @zemble/react

If you were previously using snackbar functionality from `@zemble/react`, no changes are needed! The main package re-exports all snackbar functionality for backward compatibility.

However, for new projects or if you only need snackbar functionality, you can import directly from this package.

## License

MIT