import { useMemo, useState } from 'react';
import EntityInstanceSourceNode from '../../bipartite-diagram/nodes/entity-instance-source-node';
import EntityInstanceTargetNode from '../../bipartite-diagram/nodes/entity-instance-target-node';
import { createCreatePropertySetTransformation } from '@klofan/transform';
import { useEntityToEntityDiagram } from '../../bipartite-diagram/hooks/use-entity-to-entity-diagram.ts';
import { useEditorContext } from '../../../editor/editor-context';
import { usePropertySetEndsNodesSelector } from '../../utils/diagram-node-selection/property-ends-selector/use-property-set-ends-nodes-selector.ts';
import { Entity } from '@klofan/instances';
import { EntitySet } from '@klofan/schema/representation';
import { Mapping } from '@klofan/instances/transform';
import { JoinMappingDetailMapping } from '../../utils/mapping/join/join-mapping-detail';
import { useEntities } from '../../../utils/use-entities.ts';
import { Connection } from 'reactflow';
import { useUriInput } from '../../utils/uri/use-uri-input';

export function useCreateEntityProperty() {
    const [propertySetName, setPropertySetName] = useState('');
    const uri = useUriInput('');

    const [sourceEntitySet, setSourceEntitySet] = useState<EntitySet | null>(null);
    const [targetEntitySet, setTargetEntitySet] = useState<EntitySet | null>(null);

    const [usedPropertiesMapping, setUsedPropertiesMapping] = useState<
        Mapping | JoinMappingDetailMapping
    >({
        type: 'manual-mapping',
        properties: [],
    });

    const propertyEndsSelector = usePropertySetEndsNodesSelector(
        {
            entitySet: sourceEntitySet,
            set: (entity: EntitySet) => {
                setSourceEntities([]);
                setSourceEntitySet(entity);
            },
        },
        {
            entitySet: targetEntitySet,
            set: (entity: EntitySet) => {
                setTargetEntities([]);
                setTargetEntitySet(entity);
            },
        }
    );
    const {
        schema,
        instances,
        updateSchemaAndInstances,
        help,
        manualActions: { onActionDone },
    } = useEditorContext();

    const [error, setError] = useState<string | null>(null);

    const { entities: sourceEntities, setEntities: setSourceEntities } = useEntities(
        sourceEntitySet,
        instances
    );
    const { entities: targetEntities, setEntities: setTargetEntities } = useEntities(
        targetEntitySet,
        instances
    );

    const source = { entitySet: sourceEntitySet, entities: sourceEntities };
    const target = { entitySet: targetEntitySet, entities: targetEntities };

    const {
        sourceNodes,
        targetNodes: entityTargetNodes,
        edges: entityTargetEdges,
        onConnect: onInstanceTargetConnect,
        layout,
        setEdges,
        getPropertyInstances,
    } = useEntityToEntityDiagram(
        source.entitySet !== null ? (source as { entitySet: EntitySet; entities: Entity[] }) : null,
        target.entitySet !== null ? (target as { entitySet: EntitySet; entities: Entity[] }) : null,
        null
    );

    const onConnect = (connection: Connection) => {
        setUsedPropertiesMapping({ type: 'manual-mapping', properties: [] });
        onInstanceTargetConnect(connection);
    };

    const cancel = () => {
        onActionDone();
        help.hideHelp();
    };

    const createProperty = () => {
        if (propertySetName.trim().length === 0 || !sourceEntitySet || !targetEntitySet) {
            setError('Name, source and target must be set!');
            return;
        }
        const transformation = createCreatePropertySetTransformation(
            { schema, instances },
            {
                propertySet: {
                    name: propertySetName,
                    uri: uri.asIri(),
                    value: { type: 'entity-set', entitySetId: targetEntitySet.id },
                },
                sourceEntitySetId: sourceEntitySet.id,
                propertiesMapping:
                    usedPropertiesMapping.type === 'manual-mapping' ||
                    usedPropertiesMapping.type === 'join-mapping-detail'
                        ? {
                              type: 'manual-mapping',
                              properties: getPropertyInstances(),
                          }
                        : usedPropertiesMapping,
            }
        );
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
        usedInstanceMapping: usedPropertiesMapping,
        setUsedInstanceMapping: setUsedPropertiesMapping,
        propertyEndsSelection: propertyEndsSelector,
        property: {
            name: propertySetName,
            setName: setPropertySetName,
            uri,
        },
        createProperty,
        cancel,
        error,
    };
}
