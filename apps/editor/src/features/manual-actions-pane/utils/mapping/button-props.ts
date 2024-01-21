import { EntityInstance } from '@klofan/instances';
import { PropertyInstance } from '@klofan/instances/representation';
import { Mapping } from '@klofan/instances/transform';
import { Entity } from '@klofan/schema/representation';
import { JoinMappingDetailMapping } from './join/join-mapping-detail';

export type ButtonProps = {
    setEdges: (propertyInstances: PropertyInstance[]) => void;
    usedInstanceMapping: Mapping | JoinMappingDetailMapping;
    setUsedInstanceMapping: (mapping: Mapping | JoinMappingDetailMapping) => void;
    source: { entity: Entity; instances: EntityInstance[] };
    target: { entity: Entity; instances: EntityInstance[] };
};
