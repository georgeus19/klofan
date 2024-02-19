import { identifier } from './identifier';

export function safeGet<V>(obj: { [key: identifier]: V }, key: identifier): V {
    if (Object.hasOwn(obj, key)) {
        return obj[key];
    }

    // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
    throw new Error(`Key ${key} is not in ${obj}.`);
}
