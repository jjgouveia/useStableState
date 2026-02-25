import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStableState } from './useStableState';
import { shallowEqual } from './shallowEqual';

describe('useStableState', () => {
  it('does not update if primitive value is equal', () => {
    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount++;
      return useStableState(1);
    });
    const [, setState] = result.current;

    act(() => {
      setState(1);
    });

    // Object.is(1, 1) is true, so it should not trigger an update.
    expect(renderCount).toBe(1);
  });

  it('updates if primitive value changes', () => {
    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount++;
      return useStableState(1);
    });
    const [, setState] = result.current;

    act(() => {
      setState(2);
    });

    expect(result.current[0]).toBe(2);
    expect(renderCount).toBe(2);
  });

  it('does not update if object reference is the same (default Object.is)', () => {
    let renderCount = 0;
    const initialObj = { a: 1 };
    const { result } = renderHook(() => {
      renderCount++;
      return useStableState(initialObj);
    });
    const [, setState] = result.current;

    act(() => {
      setState(initialObj);
    });

    expect(renderCount).toBe(1);
  });

  it('updates if object reference changes (default Object.is)', () => {
    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount++;
      return useStableState({ a: 1 });
    });
    const [, setState] = result.current;

    act(() => {
      setState({ a: 1 });
    });

    // Object.is({ a: 1 }, { a: 1 }) is false, so it triggers an update.
    expect(renderCount).toBe(2);
  });

  it('does not update if object is shallow equal and custom compare is provided', () => {
    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount++;
      return useStableState({ a: 1 }, { compare: shallowEqual });
    });
    const [, setState] = result.current;

    act(() => {
      setState({ a: 1 });
    });

    // shallowEqual({ a: 1 }, { a: 1 }) is true, so it should NOT trigger an update.
    expect(renderCount).toBe(1);
  });

  it('updates if object is not shallow equal and custom compare is provided', () => {
    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount++;
      return useStableState({ a: 1 }, { compare: shallowEqual });
    });
    const [, setState] = result.current;

    act(() => {
      setState({ a: 2 });
    });

    expect(result.current[0]).toEqual({ a: 2 });
    expect(renderCount).toBe(2);
  });

  it('supports functional updates', () => {
    const { result } = renderHook(() => useStableState(1));
    const [, setState] = result.current;

    act(() => {
      setState((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(2);
  });

  it('does not update if functional update returns same value', () => {
    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount++;
      return useStableState(1);
    });
    const [, setState] = result.current;

    act(() => {
      setState((prev) => prev);
    });

    expect(renderCount).toBe(1);
  });
});
