import { identifier } from '../schema/utils/identifier';

let counter = 0;

/**
 * Get new globally asigned unique ids.
 */
export function getNewId(): identifier {
    return (++counter).toString();
}
/**
 * Reset global id - only for tests.
 */
export function resetId() {
    counter = 0;
}
