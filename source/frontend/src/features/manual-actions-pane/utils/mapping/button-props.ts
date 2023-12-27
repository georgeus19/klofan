import { EntityInstance } from '../../../../core/instances/entity-instance';
import { PropertyInstance } from '../../../../core/instances/representation/property-instance';
import { Mapping } from '../../../../core/instances/transform/mapping/mapping';
import { Entity } from '../../../../core/schema/representation/item/entity';

export type ButtonProps = {
    setEdges: (propertyInstances: PropertyInstance[]) => void;
    setUsedInstanceMapping: (mapping: Mapping) => void;
    source: { entity: Entity; instances: EntityInstance[] };
    target: { entity: Entity; instances: EntityInstance[] };
};
