import { identifier } from '../../utils/identifier';
import { Relation } from './relation';

export interface Property extends Relation {
    type: 'property';
    uri?: string;
    value: identifier;
}

export function isProperty(relation: Relation): relation is Property {
    return relation.type === 'property';
}
