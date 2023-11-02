import { Literal } from './literal';

/**
 * Type for storing information of one instance of source entity for one property.
 * It contains the literals for the instance for the property and links to instances on the target entity.
 */
export interface InstanceProperty {
    targetInstanceIndices: number[];
    literals: Literal[];
}

// export type propertyType = 'literalLink' | 'entityLink';

// export interface InstanceProperty {
//     type: propertyType;
// }

// export interface LiteralInstanceProperty extends InstanceProperty {
//     type: 'literalLink';
//     literals: literal[];
// }

// export interface EntityInstanceProperty extends InstanceProperty {
//     type: 'entityLink';
//     targetInstanceIndices: number[];
// }
