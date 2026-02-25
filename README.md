# useStableState

A React hook that only updates state if the value has actually changed, with optional custom comparison support (like deep or shallow equality).

## The Problem

A classic issue in React is triggering unnecessary re-renders when you update state with an object or an array that is structurally identical, but has a new reference:

```tsx
// This triggers a re-render even though the content is exactly the same!
setState({ page: 1 })
```

Or when you receive data from an API where the content is unchanged but the object reference is new. React compares state by reference (`Object.is`), not by structure.

## The Solution

`useStableState` provides a minimal, predictable wrapper around `useState` that allows you to specify exactly how the old and new state should be compared.

### 🆚 `useState` vs `useStableState`

| Feature | `useState` | `useStableState` |
|---------|-----------|------------------|
| **Comparison Method** | Fixed to `Object.is` (Reference equality) | **Pluggable** (Reference, Shallow, or Deep) |
| **Object Updates** | Re-renders if reference changes (even if identical) | **Prevents re-render** if content is equal |
| **API Responses** | Triggers re-render on identical polled data | **Safely ignores** unchanged data |
| **Learning Curve** | Standard React | **Zero** (Same API as `useState`) |
| **Bundle Size** | Built-in | **< 1kb** (Zero dependencies) |

## Installation

```bash
npm install react-use-stable-state
# or
yarn add react-use-stable-state
# or
pnpm add react-use-stable-state
```

*(Note: update the package name to match what you actually publish on NPM).*

## Usage

### Basic Usage (Default: `Object.is`)

By default, it works exactly like `useState`, comparing by reference:

```tsx
import { useStableState } from 'react-use-stable-state';

function App() {
  const [count, setCount] = useStableState(0);

  // Normal updates work as expected
  setCount(1);
}
```

### With Shallow Comparison (Built-in)

We export a tiny, built-in `shallowEqual` utility that you can pass to the `compare` option:

```tsx
import { useStableState, shallowEqual } from 'react-use-stable-state';

function Filters() {
  const [filters, setFilters] = useStableState({ page: 1, sort: 'asc' }, {
    compare: shallowEqual
  });

  const handleUpdate = () => {
    // This will NOT trigger a re-render because it is shallowly equal!
    setFilters({ page: 1, sort: 'asc' }); 
  };

  return <button onClick={handleUpdate}>Update Filters</button>;
}
```

### With Deep Comparison (e.g., `fast-deep-equal` or `lodash.isEqual`)

If you have deeply nested objects (like complex API responses), you can inject any comparison library you want:

```tsx
import { useStableState } from 'react-use-stable-state';
import deepEqual from 'fast-deep-equal';

function DataView({ initialData }) {
  const [data, setData] = useStableState(initialData, {
    compare: deepEqual
  });

  const handleNewData = (newData) => {
    // Only re-renders if the actual deep content changed
    setData(newData);
  };
}
```

## API

### `useStableState(initialValue, options?)`

#### Parameters

- `initialValue`: The initial state value (or a lazy initializer function `() => initialValue`).
- `options` (optional):
  - `compare`: A function `(prev: T, next: T) => boolean` that returns `true` if the values should be considered equal. Defaults to `Object.is`.

#### Returns

Returns a tuple `[state, setState]` exactly like standard `useState`. `setState` supports both direct values and functional updates `(prev => next)`.

### `shallowEqual(a, b)`

A microscopic utility function that performs a shallow comparison of two objects. It returns `true` if they have the same keys with the same top-level values (compared using `Object.is`).

## Philosophy

We didn't want to:
- Reinvent a state manager
- Create magical proxies
- Force heavy comparison libraries on you

We wanted:
- A predictable, explicit wrapper
- A hook that solves the origin of the problem (`setState`) rather than patching the symptoms (e.g. `useDeepCompareEffect`)

## License

MIT
