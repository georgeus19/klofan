import { useMemo, useState } from 'react';
import { Entity } from '../../../core/schema/representation/item/entity';
import { Property } from '../../../core/schema/representation/relation/property';
import { useEntityInstanceToLiteralInstanceDiagram } from '../bipartite-diagram/hooks/use-entity-instance-to-literal-instance-diagram';
import { BipartiteDiagram } from '../bipartite-diagram/bipartite-diagram';
import EntityInstanceSourceNode from '../bipartite-diagram/nodes/entity-instance-source-node';
import { createMovePropertyTransformation } from '../../../core/transform/factory/move-property-transformation';
import LiteralTargetNode from '../bipartite-diagram/nodes/literal-target-node';
import { ActionOkCancel } from '../utils/action-ok-cancel';
import { Header } from '../utils/header';
import { LabelReadonlyInput } from '../utils/general-label-input/label-readonly-input';
import { useEditorContext } from '../../editor/editor-context';
import { Dropdown } from '../utils/dropdown';
import { EntityNodeSelector } from '../utils/diagram-node-selection/entity-selector/entity-node-selector';
import { useEntityNodeSelector } from '../utils/diagram-node-selection/entity-selector/use-entity-node-selector';
import { Mapping } from '../../../core/instances/transform/mapping/mapping';
import { PreserveButton } from '../utils/mapping/preserve-button';
import { ManualButton } from '../utils/mapping/manual-button';
import { useEntityInstances } from '../utils/use-entity-instances';
import { Connection } from 'reactflow';
import { showEntityInstanceToLiteralInstanceDiagramHelp } from '../../help/content/show-entity-instance-to-literal-instance-diagram-help';

export interface MoveLiteralPropertyProps {
    entity: Entity;
    property: Property;
}

export function MoveLiteralProperty({ entity: originalSourceEntity, property }: MoveLiteralPropertyProps) {
    const {
        schema,
        updateSchemaAndInstances,
        help,
        manualActions: { onActionDone },
    } = useEditorContext();

    const [sourceEntity, setSourceEntity] = useState<Entity>(originalSourceEntity);
    const sourceEntitySelector = useEntityNodeSelector((entity: Entity) => {
        setSourceEntity(entity);
        showEntityInstanceToLiteralInstanceDiagramHelp(help);
    });
    const { entityInstances: sourceInstances } = useEntityInstances(sourceEntity);
    const source = { entity: sourceEntity, instances: sourceInstances };

    const { sourceNodes, targetNodes, edges, setEdges, onConnect, getPropertyInstances, layout } = useEntityInstanceToLiteralInstanceDiagram(
        source,
        property.id
    );

    const { entityInstances: originalSourceInstances } = useEntityInstances(originalSourceEntity);
    const originalSource = { entity: originalSourceEntity, instances: originalSourceInstances };

    const [usedInstanceMapping, setUsedInstanceMapping] = useState<Mapping>({
        type: 'manual-mapping',
        propertyInstances: [],
    });

    const {
        sourceNodes: originalSourceNodes,
        targetNodes: originalTargetNodes,
        edges: originalEdges,
        layout: originalLayout,
    } = useEntityInstanceToLiteralInstanceDiagram(originalSource, property.id);

    const moveProperty = () => {
        const transformation = createMovePropertyTransformation(schema, {
            originalSource: originalSourceEntity.id,
            property: property.id,
            newSource: sourceEntity.id,
            instanceMapping:
                usedInstanceMapping.type === 'manual-mapping'
                    ? { type: 'manual-mapping', propertyInstances: getPropertyInstances() }
                    : usedInstanceMapping,
        });
        updateSchemaAndInstances(transformation);
        onActionDone();
        help.hideHelp();
    };
    const cancel = () => {
        onActionDone();
        help.hideHelp();
    };

    const nodeTypes = useMemo(() => ({ source: EntityInstanceSourceNode, target: LiteralTargetNode }), []);
    const edgeTypes = useMemo(() => ({}), []);

    return (
        <div>
            <Header label='Move Property'></Header>
            <LabelReadonlyInput label='Property' value={`${originalSourceEntity.name}.${property.name}`}></LabelReadonlyInput>
            <Dropdown headerLabel='Original Mapping' showInitially={false}>
                <LabelReadonlyInput label='Original Source' value={originalSourceEntity.name}></LabelReadonlyInput>
                <BipartiteDiagram
                    sourceNodes={originalSourceNodes}
                    targetNodes={originalTargetNodes}
                    edges={originalEdges}
                    layout={originalLayout}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                ></BipartiteDiagram>
            </Dropdown>
            <Dropdown headerLabel='New Mapping' showInitially>
                <EntityNodeSelector label='Source' {...sourceEntitySelector} entity={sourceEntity}></EntityNodeSelector>
                <div className='grid grid-cols-2'>
                    <PreserveButton
                        setEdges={setEdges}
                        usedInstanceMapping={usedInstanceMapping}
                        setUsedInstanceMapping={setUsedInstanceMapping}
                        source={source}
                        target={{ item: schema.literal(property.value) }}
                        originalSource={{ entity: originalSourceEntity, instances: originalSourceInstances }}
                        originalTarget={{ item: schema.literal(property.value) }}
                        property={property}
                    ></PreserveButton>
                    <ManualButton
                        setEdges={setEdges}
                        setUsedInstanceMapping={setUsedInstanceMapping}
                        usedInstanceMapping={usedInstanceMapping}
                    ></ManualButton>
                </div>
                <BipartiteDiagram
                    sourceNodes={sourceNodes}
                    targetNodes={targetNodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    layout={layout}
                    onConnect={(connection: Connection) => {
                        setUsedInstanceMapping({ type: 'manual-mapping', propertyInstances: [] });
                        onConnect(connection);
                    }}
                ></BipartiteDiagram>
            </Dropdown>
            <ActionOkCancel onOk={moveProperty} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
