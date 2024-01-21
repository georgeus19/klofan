import { identifier } from './identifier';

let counter = 0;

/**
 * Get new globally asigned unique ids.
 */
export function getNewId(): identifier {
    return (++counter).toString();
}
/**
 * Reset global id.
 */
export function resetId() {
    counter = 0;
}
