import { State } from '../state/state';

export interface Command {
    apply(state: State): State;
}
