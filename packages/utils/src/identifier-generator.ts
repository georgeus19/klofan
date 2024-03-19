import { identifier } from './identifier';
import { v4 as uuidv4 } from 'uuid';

let counter = 0;

export let useCounter = false;

/**
 * Get new globally asigned unique ids.
 */
export function getNewId(): identifier {
    if (useCounter) {
        return (++counter).toString();
    } else {
        return uuidv4();
    }
}
/**
 * Reset global id.
 */
export function resetId() {
    useCounter = true;
    counter = 0;
}
