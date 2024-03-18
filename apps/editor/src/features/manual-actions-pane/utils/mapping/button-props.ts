import { Entity } from '@klofan/instances/representation';
import { Property } from '@klofan/instances/representation';
import { Mapping } from '@klofan/instances/transform';
import { EntitySet } from '@klofan/schema/representation';
import { JoinMappingDetailMapping } from './join/join-mapping-detail';

export type ButtonProps = {
    setEdges: (properties: Property[]) => void;
    usedInstanceMapping: Mapping | JoinMappingDetailMapping;
    setUsedInstanceMapping: (mapping: Mapping | JoinMappingDetailMapping) => void;
    source: { entitySet: EntitySet; entities: Entity[] };
    target: { entitySet: EntitySet; entities: Entity[] };
};
