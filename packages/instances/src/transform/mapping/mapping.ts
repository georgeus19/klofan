import { Property } from '../../representation/property';
import { RawInstances } from '../../representation/raw-instances';
import { AllToOneMapping, getAllToOneMappingPropertyInstances } from './all-to-one-mapping';
import { JoinMapping, getJoinMappingPropertyInstances } from './join-mapping';
import { ManualMapping } from './manual-mapping';
import { OneToAllMapping, getOneToAllMappingPropertyInstances } from './one-to-all-mapping';
import { OneToOneMapping, getOneToOneMappingPropertyInstances } from './one-to-one-mapping';
import { PreserveMapping, getPreserveMappingPropertyInstances } from './preserve-mapping';

export type Mapping = PreserveMapping | JoinMapping | OneToOneMapping | OneToAllMapping | AllToOneMapping | ManualMapping;

export function getPropertyInstances(instances: RawInstances, mapping: Mapping): Property[] {
    switch (mapping.type) {
        case 'join-mapping':
            return getJoinMappingPropertyInstances(instances, mapping);
        case 'preserve-mapping':
            return getPreserveMappingPropertyInstances(instances, mapping);
        case 'one-to-one-mapping':
            return getOneToOneMappingPropertyInstances(instances, mapping);
        case 'one-to-all-mapping':
            return getOneToAllMappingPropertyInstances(instances, mapping);
        case 'all-to-one-mapping':
            return getAllToOneMappingPropertyInstances(instances, mapping);
        case 'manual-mapping':
            return mapping.propertyInstances;
    }
}
