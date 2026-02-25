type CompareFn<T> = (a: T, b: T) => boolean;
interface StableOptions<T> {
    compare?: CompareFn<T>;
}
declare function useStableState<T>(initial: T | (() => T), options?: StableOptions<T>): readonly [T, (next: T | ((prev: T) => T)) => void];

declare function shallowEqual(a: any, b: any): boolean;

export { type StableOptions, shallowEqual, useStableState };
