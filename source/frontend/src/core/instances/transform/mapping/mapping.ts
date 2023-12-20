import { Instances } from '../../instances';
import { PropertyInstance } from '../../representation/property-instance';
import { AllToOneMapping, getAllToOnePropertyInstances } from './all-one-mapping';
import { JoinMapping, getJoinedPropertyInstances } from './join-mapping';
import { ManualMapping } from './manual-mapping';
import { OneToAllMapping, getOneToAllPropertyInstances } from './one-all-mapping';
import { OneToOneMapping, getOneToOnePropertyInstances } from './one-one-mapping';
import { PreserveMapping, getPreservedPropertyInstances } from './preserve-mapping';

export type Mapping = PreserveMapping | JoinMapping | OneToOneMapping | OneToAllMapping | AllToOneMapping | ManualMapping;

export function getPropertyInstances(instances: Instances, mapping: Mapping): Promise<PropertyInstance[]> {
    switch (mapping.type) {
        case 'join-mapping':
            return getJoinedPropertyInstances(instances, mapping);
        case 'preserve-mapping':
            return getPreservedPropertyInstances(instances, mapping);
        case 'one-one':
            return getOneToOnePropertyInstances(instances, mapping);
        case 'one-all':
            return getOneToAllPropertyInstances(instances, mapping);
        case 'all-one':
            return getAllToOnePropertyInstances(instances, mapping);
        case 'manual-mapping':
            return Promise.resolve(mapping.propertyInstances);
    }
}
