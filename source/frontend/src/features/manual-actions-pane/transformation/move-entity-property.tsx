import { useEffect, useMemo, useState } from 'react';
import { Entity } from '../../../core/schema/representation/item/entity';
import { Property } from '../../../core/schema/representation/relation/property';
import { useEntityInstanceToEntityInstanceDiagram } from '../bipartite-diagram/hooks/use-entity-instance-to-entity-instance-diagram';
import { NodeSelect } from '../utils/node-select';
import { BipartiteDiagram } from '../bipartite-diagram/bipartite-diagram';
import EntityInstanceSourceNode from '../bipartite-diagram/nodes/entity-instance-source-node';
import EntityInstanceTargetNode from '../bipartite-diagram/nodes/entity-instance-target-node';
import UpdatableLiteralTargetNode from '../bipartite-diagram/nodes/updatable-literal-target-node';
import { createMovePropertyTransformation } from '../../../core/transform/factory/move-property-transformation';
import { ActionOkCancel } from '../utils/action-ok-cancel';
import { Header } from '../utils/header';
import { LabelReadonlyInput } from '../utils/label-readonly-input';
import { useEditorContext } from '../../editor/editor-context';
import { Dropdown } from '../utils/dropdown';

export interface MoveEntityPropertyProps {
    entity: Entity;
    property: Property;
}

export function MoveEntityProperty({ entity: originalSourceEntity, property }: MoveEntityPropertyProps) {
    const {
        schema,
        updateSchemaAndInstances,
        diagram: {
            nodeSelection: { selectedNode, clearSelectedNode },
        },
        help,
        manualActions: { onActionDone },
    } = useEditorContext();

    const originalTargetEntity = schema.entity(property.value);
    const [nodeSelection, setNodeSelection] = useState<{ type: 'source' } | { type: 'target' } | null>(null);
    const [sourceEntity, setSourceEntity] = useState<Entity>(originalSourceEntity);
    const [targetEntity, setTargetEntity] = useState<Entity>(originalTargetEntity);

    const { sourceNodes, targetNodes, edges, onConnect, getPropertyInstances, layout } = useEntityInstanceToEntityInstanceDiagram(
        sourceEntity,
        targetEntity,
        property.id
    );

    const {
        sourceNodes: originalSourceNodes,
        targetNodes: originalTargetNodes,
        edges: originalEdges,
        layout: originalLayout,
    } = useEntityInstanceToEntityInstanceDiagram(originalSourceEntity, originalTargetEntity, property.id);

    useEffect(() => {
        if (selectedNode && nodeSelection) {
            if (nodeSelection.type === 'source') {
                setSourceEntity(selectedNode.data);
            } else {
                setTargetEntity(selectedNode.data);
            }

            if ((sourceEntity && nodeSelection.type === 'target') || (targetEntity && nodeSelection.type === 'source')) {
                help.showEntityInstanceToEntityInstanceDiagramHelp();
            }

            clearSelectedNode();
            setNodeSelection(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNode]);

    const moveProperty = () => {
        const transformation = createMovePropertyTransformation(schema, {
            originalSource: originalSourceEntity.id,
            property: property.id,
            newSource: sourceEntity.id,
            newTarget: targetEntity.id,
            propertyInstances: getPropertyInstances(),
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
        () => ({ source: EntityInstanceSourceNode, target: EntityInstanceTargetNode, literal: UpdatableLiteralTargetNode }),
        []
    );
    const edgeTypes = useMemo(() => ({}), []);

    return (
        <div>
            <Header label='Move Property'></Header>
            <LabelReadonlyInput label='Property' value={`${originalSourceEntity.name}.${property.name}`}></LabelReadonlyInput>
            <Dropdown headerLabel='Original Mapping' showInitially={false}>
                <LabelReadonlyInput label='Original Source' value={originalSourceEntity.name}></LabelReadonlyInput>
                <LabelReadonlyInput label='Original Target' value={originalTargetEntity.name}></LabelReadonlyInput>
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
                <NodeSelect
                    label='Source'
                    displayValue={sourceEntity?.name}
                    onSelect={() => {
                        help.showNodeSelectionHelp();
                        setNodeSelection({ type: 'source' });
                    }}
                ></NodeSelect>
                <NodeSelect
                    label='Target'
                    displayValue={targetEntity?.name}
                    onSelect={() => {
                        help.showNodeSelectionHelp();
                        setNodeSelection({ type: 'target' });
                    }}
                ></NodeSelect>
                <BipartiteDiagram
                    sourceNodes={sourceNodes}
                    targetNodes={targetNodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    layout={layout}
                    onConnect={onConnect}
                ></BipartiteDiagram>
            </Dropdown>
            <ActionOkCancel onOk={moveProperty} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
