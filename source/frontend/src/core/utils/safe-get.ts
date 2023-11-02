import { identifier } from '../schema/utils/identifier';

export function safeGet<V>(obj: { [key: identifier]: V }, key: identifier): V {
    if (Object.hasOwn(obj, key)) {
        return obj[key];
    }

    throw new Error(`Key ${key} is not in ${obj}.`);
}
