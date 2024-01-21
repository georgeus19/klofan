import type {identifier} from '@klofan/utils'

export type relationType = 'property' | 'graph-property';

export interface Relation {
    id: identifier;
    name: string;
    type: relationType;
}
