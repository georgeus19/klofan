import { identifier } from '@klofan/utils';
import { Property } from './property';
import { EntityWithoutProperties } from './entity';

export interface RawInstances {
    // entities: {
    //     [key: identifier]: { count: number; instances: { uri?: string }[] };
    // };
    // entities: {
    //     [key: identifier]: { uri: (string | null)[], type: number[] };
    // };
    entities: {
        [key: identifier]: EntityWithoutProperties[];
    };
    /**
     * Column representation of which entity instances have which properties and their values.
     * All values (arrays) have the same length - the number of instances of the corresponding schema entity (which is the source entity of the property).
     *
     * Key format is: `${EntitySetId}.${PropertySetId}`
     *
     */
    properties: { [key: string]: Property[] };
}

export function copyInstances(instances: RawInstances): RawInstances {
    return {
        entities: { ...instances.entities },
        properties: { ...instances.properties },
    };
}

export function createEmptyInstanceState(): RawInstances {
    return { entities: {}, properties: {} };
}

/**
 * Create key (on `RawInstances.properties`) for getting instance information of `propertySet` on `entitySet`.
 */
export function propertyKey(entitySet: identifier, propertySet: identifier): string {
    return `${entitySet}.${propertySet}`;
}

export function initEntities(count: number): EntityWithoutProperties[] {
    return [...Array(count).keys()].map(() => ({}));
}
