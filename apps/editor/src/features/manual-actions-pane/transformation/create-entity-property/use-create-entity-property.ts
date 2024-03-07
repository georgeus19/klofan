import { useMemo, useState } from 'react';
import EntityInstanceSourceNode from '../../bipartite-diagram/nodes/entity-instance-source-node';
import EntityInstanceTargetNode from '../../bipartite-diagram/nodes/entity-instance-target-node';
import { createCreatePropertyTransformation } from '@klofan/transform';
import { useEntityInstanceToEntityInstanceDiagram } from '../../bipartite-diagram/hooks/use-entity-instance-to-entity-instance-diagram';
import { useEditorContext } from '../../../editor/editor-context';
import { usePropertyEndsNodesSelector } from '../../utils/diagram-node-selection/property-ends-selector/use-property-ends-nodes-selector';
import { Entity } from '@klofan/instances';
import { EntitySet } from '@klofan/schema/representation';
import { Mapping } from '@klofan/instances/transform';
import { JoinMappingDetailMapping } from '../../utils/mapping/join/join-mapping-detail';
import { useEntityInstances } from '../../utils/use-entity-instances';
import { Connection } from 'reactflow';
import { useUriInput } from '../../utils/uri/use-uri-input';

export function useCreateEntityProperty() {
    const [propertyName, setPropertyName] = useState('');
    const uri = useUriInput('');

    const [sourceEntity, setSourceEntity] = useState<EntitySet | null>(null);
    const [targetEntity, setTargetEntity] = useState<EntitySet | null>(null);

    const [usedInstanceMapping, setUsedInstanceMapping] = useState<
        Mapping | JoinMappingDetailMapping
    >({
        type: 'manual-mapping',
        propertyInstances: [],
    });

    const propertyEndsSelector = usePropertyEndsNodesSelector(
        {
            entity: sourceEntity,
            set: (entity: EntitySet) => {
                setSourceInstances([]);
                setSourceEntity(entity);
            },
        },
        {
            entity: targetEntity,
            set: (entity: EntitySet) => {
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

    const { entityInstances: sourceInstances, setEntityInstances: setSourceInstances } =
        useEntityInstances(sourceEntity);
    const { entityInstances: targetInstances, setEntityInstances: setTargetInstances } =
        useEntityInstances(targetEntity);

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
        source.entity !== null ? (source as { entity: EntitySet; instances: Entity[] }) : null,
        target.entity !== null ? (target as { entity: EntitySet; instances: Entity[] }) : null,
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
                uri: uri.asIri(),
                value: { type: 'entity', entityId: targetEntity.id },
            },
            sourceEntityId: sourceEntity.id,
            propertyInstances: getEntityInstanceTargetPropertyInstances(),
        });
        updateSchemaAndInstances(transformation);
        onActionDone();
        help.hideHelp();
    };

    const nodeTypes = useMemo(
        () => ({ source: EntityInstanceSourceNode, target: EntityInstanceTargetNode }),
        []
    );
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
        property: {
            name: propertyName,
            setName: setPropertyName,
            uri,
        },
        createProperty,
        cancel,
        error,
    };
}
