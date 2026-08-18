---
"@zemble/primitives": patch
---

Overlay: inline the absolute-fill style instead of spreading `StyleSheet.absoluteFillObject`. React Native 0.85 removed `absoluteFillObject`, which made the spread resolve to `undefined` at runtime (silently dropping `position: 'absolute'`) and fail typechecking. Spreading `StyleSheet.absoluteFill` isn't an option either — it's typed as an opaque `RegisteredStyle` on React Native <= 0.84, so it errors with TS2698 there. The inline literal works across the whole `react-native: "*"` peer range.
