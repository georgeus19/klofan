import { useMemo, useState } from 'react';
import EntityInstanceSourceNode from '../../bipartite-diagram/nodes/entity-instance-source-node';
import EntityInstanceTargetNode from '../../bipartite-diagram/nodes/entity-instance-target-node';
import { createCreatePropertyTransformation } from '../../../../core/transform/factory/create-property-transformation';
import { useEntityInstanceToEntityInstanceDiagram } from '../../bipartite-diagram/hooks/use-entity-instance-to-entity-instance-diagram';
import { useEditorContext } from '../../../editor/editor-context';
import { usePropertyEndsNodesSelector } from '../../utils/diagram-node-selection/property-ends-selector/use-property-ends-nodes-selector';
import { EntityInstance } from '../../../../core/instances/entity-instance';
import { Entity } from '../../../../core/schema/representation/item/entity';
import { Mapping } from '../../../../core/instances/transform/mapping/mapping';
import { JoinMappingDetailMapping } from '../../utils/mapping/join/join-mapping-detail';
import { useEntityInstances } from '../../utils/use-entity-instances';
import { Connection } from 'reactflow';

export function useCreateEntityProperty() {
    const [propertyName, setPropertyName] = useState('');
    const [sourceEntity, setSourceEntity] = useState<Entity | null>(null);
    const [targetEntity, setTargetEntity] = useState<Entity | null>(null);

    const [usedInstanceMapping, setUsedInstanceMapping] = useState<Mapping | JoinMappingDetailMapping>({
        type: 'manual-mapping',
        propertyInstances: [],
    });

    const propertyEndsSelector = usePropertyEndsNodesSelector(
        {
            entity: sourceEntity,
            set: (entity: Entity) => {
                setSourceInstances([]);
                setSourceEntity(entity);
            },
        },
        {
            entity: targetEntity,
            set: (entity: Entity) => {
                setTargetInstances([]);
                setTargetEntity(entity);
            },
        }
    );
    const {
        schema,
        updateSchemaAndInstances,
        help,
        manualActions: { onActionDone },
    } = useEditorContext();

    const [error, setError] = useState<string | null>(null);

    const { entityInstances: sourceInstances, setEntityInstances: setSourceInstances } = useEntityInstances(sourceEntity);
    const { entityInstances: targetInstances, setEntityInstances: setTargetInstances } = useEntityInstances(targetEntity);

    const source = { entity: sourceEntity, instances: sourceInstances };
    const target = { entity: targetEntity, instances: targetInstances };

    const {
        sourceNodes,
        targetNodes: entityTargetNodes,
        edges: entityTargetEdges,
        onConnect: onInstanceTargetConnect,
        layout,
        setEdges,
        getPropertyInstances: getEntityInstanceTargetPropertyInstances,
    } = useEntityInstanceToEntityInstanceDiagram(
        source.entity !== null ? (source as { entity: Entity; instances: EntityInstance[] }) : null,
        target.entity !== null ? (target as { entity: Entity; instances: EntityInstance[] }) : null,
        null
    );

    const onConnect = (connection: Connection) => {
        setUsedInstanceMapping({ type: 'manual-mapping', propertyInstances: [] });
        onInstanceTargetConnect(connection);
    };

    const cancel = () => {
        onActionDone();
        help.hideHelp();
    };

    const createProperty = () => {
        if (propertyName.trim().length === 0 || !sourceEntity || !targetEntity) {
            setError('Name, source and target must be set!');
            return;
        }
        const transformation = createCreatePropertyTransformation(schema, {
            property: {
                name: propertyName,
                value: { type: 'entity', entityId: targetEntity.id },
            },
            sourceEntityId: sourceEntity.id,
            propertyInstances: getEntityInstanceTargetPropertyInstances(),
        });
        updateSchemaAndInstances(transformation);
        onActionDone();
        help.hideHelp();
    };

    const nodeTypes = useMemo(() => ({ source: EntityInstanceSourceNode, target: EntityInstanceTargetNode }), []);
    const edgeTypes = useMemo(() => ({}), []);

    return {
        diagram: {
            sourceNodes: sourceNodes,
            targetNodes: entityTargetNodes,
            edges: entityTargetEdges,
            onConnect: onConnect,
            layout: layout,
            nodeTypes,
            edgeTypes,
            setEdges,
        },
        source,
        target,
        usedInstanceMapping,
        setUsedInstanceMapping,
        propertyEndsSelection: propertyEndsSelector,
        propertyName,
        setPropertyName,
        createProperty,
        cancel,
        error,
    };
}
