/**
 * Wrapper for Map which returns `Value` when element is accessed instead `Value | undefined`.
 * If element is not in the map, Error is thrown.
 */
export class SafeMap<K, V> {
    private map;

    constructor(iterable?: Iterable<readonly [K, V]>) {
        if (iterable) {
            this.map = new Map<K, V>(iterable);
        } else {
            this.map = new Map<K, V>();
        }
    }

    get(key: K): V {
        const value = this.map.get(key);
        if (value) {
            return value;
        }
        throw new Error(`Key ${key} is not in ${this.map}.`);
    }

    set(key: K, value: V): SafeMap<K, V> {
        this.map.set(key, value);
        return this;
    }

    [Symbol.iterator]() {
        return this.map[Symbol.iterator]();
    }
}
