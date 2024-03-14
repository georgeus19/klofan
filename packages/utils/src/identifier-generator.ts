import { identifier } from './identifier';
import { v4 as uuidv4 } from 'uuid';

let counter = 0;

/**
 * Get new globally asigned unique ids.
 */
export function getNewId(): identifier {
    return uuidv4();
    // return (++counter).toString();
}
/**
 * Reset global id.
 */
export function resetId() {
    counter = 0;
}
