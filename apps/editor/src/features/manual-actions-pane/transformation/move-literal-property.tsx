import { useMemo, useState } from 'react';
import { PropertySet, EntitySet } from '@klofan/schema/representation';
import { useEntityToLiteralDiagram } from '../bipartite-diagram/hooks/use-entity-to-literal-diagram.ts';
import { BipartiteDiagram } from '../bipartite-diagram/bipartite-diagram';
import EntityInstanceSourceNode from '../bipartite-diagram/nodes/entity-instance-source-node';
import { createMovePropertySetTransformation } from '@klofan/transform';
import LiteralTargetNode from '../bipartite-diagram/nodes/literal-target-node';
import { ActionOkCancel } from '../utils/action-ok-cancel';
import { Header } from '../utils/header';
import { LabelReadonlyInput } from '../utils/general-label-input/label-readonly-input';
import { useEditorContext } from '../../editor/editor-context';
import { Dropdown } from '../../utils/dropdown.tsx';
import { EntitySetNodeSelector } from '../utils/diagram-node-selection/entity-set-selector/entity-set-node-selector.tsx';
import { useEntitySetNodeSelector } from '../utils/diagram-node-selection/entity-set-selector/use-entity-set-node-selector.ts';
import { Mapping } from '@klofan/instances/transform';
import { PreserveButton } from '../utils/mapping/preserve-button';
import { ManualButton } from '../utils/mapping/manual-button';
import { useEntities } from '../../utils/use-entities.ts';
import { Connection } from 'reactflow';
import { showEntityToLiteralDiagramHelp } from '../../help/content/show-entity-to-literal-diagram-help.tsx';

export interface MoveLiteralPropertyProps {
    entity: EntitySet;
    property: PropertySet;
}

export function MoveLiteralProperty({
    entity: originalSourceEntity,
    property,
}: MoveLiteralPropertyProps) {
    const {
        schema,
        instances,
        updateSchemaAndInstances,
        help,
        manualActions: { onActionDone },
    } = useEditorContext();

    const [sourceEntity, setSourceEntity] = useState<EntitySet>(originalSourceEntity);
    const sourceEntitySelector = useEntitySetNodeSelector((entity: EntitySet) => {
        setSourceEntity(entity);
        showEntityToLiteralDiagramHelp(help);
    });
    const { entities: sourceEntities } = useEntities(sourceEntity, instances);
    const source = { entitySet: sourceEntity, entities: sourceEntities };

    const { sourceNodes, targetNodes, edges, setEdges, onConnect, getPropertyInstances, layout } =
        useEntityToLiteralDiagram(source, property.id);

    const { entities: originalSourceEntities } = useEntities(originalSourceEntity, instances);
    const originalSource = { entitySet: originalSourceEntity, entities: originalSourceEntities };

    const [usedPropertiesMapping, setUsedPropertiesMapping] = useState<Mapping>({
        type: 'manual-mapping',
        properties: [],
    });

    const {
        sourceNodes: originalSourceNodes,
        targetNodes: originalTargetNodes,
        edges: originalEdges,
        layout: originalLayout,
    } = useEntityToLiteralDiagram(originalSource, property.id);

    const moveProperty = () => {
        const transformation = createMovePropertySetTransformation(schema, {
            originalSource: originalSourceEntity.id,
            propertySet: property.id,
            newSource: sourceEntity.id,
            propertiesMapping:
                usedPropertiesMapping.type === 'manual-mapping'
                    ? { type: 'manual-mapping', properties: getPropertyInstances() }
                    : usedPropertiesMapping,
        });
        updateSchemaAndInstances(transformation);
        onActionDone();
        help.hideHelp();
    };
    const cancel = () => {
        onActionDone();
        help.hideHelp();
    };

    const nodeTypes = useMemo(
        () => ({ source: EntityInstanceSourceNode, target: LiteralTargetNode }),
        []
    );
    const edgeTypes = useMemo(() => ({}), []);

    return (
        <div>
            <Header label='Move PropertySet'></Header>
            <LabelReadonlyInput
                label='PropertySet'
                value={`${originalSourceEntity.name}.${property.name}`}
            ></LabelReadonlyInput>
            <Dropdown headerLabel='Original Mapping' showInitially={false}>
                <LabelReadonlyInput
                    label='Original Source'
                    value={originalSourceEntity.name}
                ></LabelReadonlyInput>
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
                <EntitySetNodeSelector
                    label='Source'
                    {...sourceEntitySelector}
                    entitySet={sourceEntity}
                ></EntitySetNodeSelector>
                <div className='grid grid-cols-2'>
                    <PreserveButton
                        setEdges={setEdges}
                        usedInstanceMapping={usedPropertiesMapping}
                        setUsedInstanceMapping={setUsedPropertiesMapping}
                        source={source}
                        target={{ item: schema.literalSet(property.value) }}
                        originalSource={{
                            entitySet: originalSourceEntity,
                            entities: originalSourceEntities,
                        }}
                        originalTarget={{ item: schema.literalSet(property.value) }}
                        propertySet={property}
                    ></PreserveButton>
                    <ManualButton
                        setEdges={setEdges}
                        setUsedInstanceMapping={setUsedPropertiesMapping}
                        usedInstanceMapping={usedPropertiesMapping}
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
                        setUsedPropertiesMapping({ type: 'manual-mapping', properties: [] });
                        onConnect(connection);
                    }}
                ></BipartiteDiagram>
            </Dropdown>
            <ActionOkCancel onOk={moveProperty} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
