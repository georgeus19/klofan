import { Item } from '../item/item';
import { Relation } from './relation';

export interface GraphProperty extends Relation {
    type: 'graph-property';
    uri?: string;
    value: Item;
}
