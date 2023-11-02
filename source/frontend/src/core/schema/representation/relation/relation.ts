import { identifier } from '../../utils/identifier';

export type relationType = 'property' | 'graph-property';

export interface Relation {
    id: identifier;
    name: string;
    type: relationType;
}
