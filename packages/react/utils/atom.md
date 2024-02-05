# Atom

Atom is the root primitive that is missing in React (could be extended for others). It is a simple object that holds a value and can be set and read independently of the React lifecycle:
- It makes it easy to hold a singleton state (for example auth token)
- It makes it easy to hold a state that is not related to the component lifecycle (for example background jobs in React Native)
- It can potentially sync state with other frameworks than React
- It integrates fully with the React lifecycle, as one would expect, but you can also use it without triggering a re-render (by using `.get()` or `.value`)

## createAtom

The base for everything is create atom. This holds a value and can be read and set.

```typescript
const atom = createAtom(5)

console.log(atom.value) // 5
atom.set(6)
console.log(atom.value) // 6
```
## .set()
Similarly to setState you can supply a callback to the set method. This callback will receive the current value and should return the new value, which results in an atomic update
```typescript
atom.set(v => v + 1)
```

## .get()
You can read the value of the atom using the `.get()` method or by accessing the `.value` property
```typescript
console.log(atom.get()) // 7
console.log(atom.value) // 7
```

## useAtom

The `useAtom` hook is the main way to interact with atoms in a React component or custom hook. It returns the current value. The component will re-render when the value changes. 

We considered returning the same signature as `useState` for familiarity but decided against it. The `.set()` function does not care whether it's executed in a React context or not, so it wouldn't add any value.

```typescript
function MyComponent() {
  const value = useAtom(atom)
  const increment = () => atom.set(v => v + 1)

  return <div onClick={increment}>{value}</div>
}
```

## Persisting atoms

You can persist atoms using the `persistAtom` function. This will store the atom in localStorage and rehydrate it on page load. It takes the atom, a key and any compatible storage (localStorage, sessionStorage or AsyncStorage). It basically accepts any key value store that has a `getItem` and `setItem` method. By default it will persist the atom every 100ms, but you can pass any debounce time in milliseconds as the third argument.

```typescript
const atom = createAtom(5)
persistAtom(atom, 'my-atom-key', localStorage)
```