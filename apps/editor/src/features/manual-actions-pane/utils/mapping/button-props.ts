import { EntityInstance } from '@klofan/instances';
import { Property } from '@klofan/instances/representation';
import { Mapping } from '@klofan/instances/transform';
import { EntitySet } from '@klofan/schema/representation';
import { JoinMappingDetailMapping } from './join/join-mapping-detail';

export type ButtonProps = {
    setEdges: (propertyInstances: Property[]) => void;
    usedInstanceMapping: Mapping | JoinMappingDetailMapping;
    setUsedInstanceMapping: (mapping: Mapping | JoinMappingDetailMapping) => void;
    source: { entity: EntitySet; instances: EntityInstance[] };
    target: { entity: EntitySet; instances: EntityInstance[] };
};
