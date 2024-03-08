import { Property } from '../../representation/property';
import { RawInstances } from '../../representation/raw-instances';
import { AllToOneMapping, getAllToOneMappingProperties } from './all-to-one-mapping';
import { JoinMapping, getJoinMappingProperties } from './join-mapping';
import { ManualMapping } from './manual-mapping';
import { OneToAllMapping, getOneToAllMappingProperties } from './one-to-all-mapping';
import { OneToOneMapping, getOneToOneMappingProperties } from './one-to-one-mapping';
import { PreserveMapping, getPreserveMappingProperties } from './preserve-mapping';

export type Mapping =
    | PreserveMapping
    | JoinMapping
    | OneToOneMapping
    | OneToAllMapping
    | AllToOneMapping
    | ManualMapping;

export function getProperties(instances: RawInstances, mapping: Mapping): Property[] {
    switch (mapping.type) {
        case 'join-mapping':
            return getJoinMappingProperties(instances, mapping);
        case 'preserve-mapping':
            return getPreserveMappingProperties(instances, mapping);
        case 'one-to-one-mapping':
            return getOneToOneMappingProperties(instances, mapping);
        case 'one-to-all-mapping':
            return getOneToAllMappingProperties(instances, mapping);
        case 'all-to-one-mapping':
            return getAllToOneMappingProperties(instances, mapping);
        case 'manual-mapping':
            return mapping.properties;
    }
}
