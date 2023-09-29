import { SafeMap } from '../safe-map';

/**
 * Type for entity and property ids. Since it is primitive, it is lowercase.
 */
export type id = string;

export interface Entity {
    id: id;
    properties: string[];
}

export interface Property {
    id: id;
    name: string;
    value: id;
}

export interface SchemaState {
    entities: SafeMap<id, Entity>;
    properties: SafeMap<id, Property>;
}
