# @zemble/primitives

## 1.0.3

### Patch Changes

- d371560: Overlay: inline the absolute-fill style instead of spreading `StyleSheet.absoluteFillObject`. React Native 0.85 removed `absoluteFillObject`, which made the spread resolve to `undefined` at runtime (silently dropping `position: 'absolute'`) and fail typechecking. Spreading `StyleSheet.absoluteFill` isn't an option either — it's typed as an opaque `RegisteredStyle` on React Native <= 0.84, so it errors with TS2698 there. The inline literal works across the whole `react-native: "*"` peer range.

## 1.0.2

### Patch Changes

- 988c189: more type fixes

## 1.0.1

### Patch Changes

- 6ba64d8: Refactor react package
- 7cee002: replace eslint with biome
