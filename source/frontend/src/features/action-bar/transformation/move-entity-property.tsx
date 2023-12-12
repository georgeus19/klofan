import { useEffect, useMemo, useState } from 'react';
import { Entity } from '../../../core/schema/representation/item/entity';
import { Property } from '../../../core/schema/representation/relation/property';
import { useSchemaContext } from '../../schema-context';
import { useActionContext } from '../action-context';
import { useEntityInstanceToEntityInstanceDiagram } from '../bipartite-diagram/hooks/use-entity-instance-to-entity-instance-diagram';
import { NodeSelect } from '../utils/node-select';
import { BipartiteDiagram } from '../bipartite-diagram/bipartite-diagram';
import EntityInstanceSourceNode from '../bipartite-diagram/nodes/entity-instance-source-node';
import EntityInstanceTargetNode from '../bipartite-diagram/nodes/entity-instance-target-node';
import UpdatableLiteralTargetNode from '../bipartite-diagram/nodes/updatable-literal-target-node';
import { createMovePropertyTransformation } from '../../../core/transform/factory/move-property-transformation';
import { useInstancesContext } from '../../instances-context';
import { useNodeSelectionContext } from '../../diagram/node-selection/node-selection-context';
import { ActionOkCancel } from '../utils/action-ok-cancel';
import { Header } from '../utils/header';
import { LabelReadonlyInput } from '../utils/label-readonly-input';
import { useHelpContext } from '../../help/help-context';

export interface MoveEntityPropertyProps {
    entity: Entity;
    property: Property;
}

export function MoveEntityProperty({ entity, property }: MoveEntityPropertyProps) {
    const { schema, updateSchema } = useSchemaContext();
    const [nodeSelection, setNodeSelection] = useState<{ type: 'source' } | { type: 'target' } | null>(null);
    const [sourceEntity, setSourceEntity] = useState<Entity>(entity);
    const [targetEntity, setTargetEntity] = useState<Entity>(schema.entity(property.value));

    const { updateInstances } = useInstancesContext();
    const { selectedNode, clearSelectedNode } = useNodeSelectionContext();
    const { onActionDone } = useActionContext();
    const { showNodeSelectionHelp, showEntityInstanceToEntityInstanceDiagramHelp, hideHelp } = useHelpContext();

    const { sourceNodes, targetNodes, edges, onConnect, getPropertyInstances, layout } = useEntityInstanceToEntityInstanceDiagram(
        sourceEntity,
        targetEntity,
        property.id
    );

    useEffect(() => {
        if (selectedNode && nodeSelection) {
            if (nodeSelection.type === 'source') {
                setSourceEntity(selectedNode.data);
            } else {
                setTargetEntity(selectedNode.data);
            }

            if ((sourceEntity && nodeSelection.type === 'target') || (targetEntity && nodeSelection.type === 'source')) {
                showEntityInstanceToEntityInstanceDiagramHelp();
            }

            clearSelectedNode();
            setNodeSelection(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNode]);

    const moveProperty = () => {
        const transformation = createMovePropertyTransformation(schema, {
            originalSource: entity.id,
            property: property.id,
            newSource: sourceEntity.id,
            newTarget: targetEntity.id,
            propertyInstances: getPropertyInstances(),
        });
        updateSchema(transformation.schemaTransformations);
        updateInstances(transformation.instanceTransformations);
        onActionDone();
        hideHelp();
    };
    const cancel = () => {
        onActionDone();
        hideHelp();
    };

    const nodeTypes = useMemo(
        () => ({ source: EntityInstanceSourceNode, target: EntityInstanceTargetNode, literal: UpdatableLiteralTargetNode }),
        []
    );
    const edgeTypes = useMemo(() => ({}), []);

    return (
        <div>
            <Header label='Move Property'></Header>
            <LabelReadonlyInput label='Property' value={`${entity.name}.${property.name}`}></LabelReadonlyInput>
            <NodeSelect
                label='Source'
                displayValue={sourceEntity?.name}
                onSelect={() => {
                    showNodeSelectionHelp();
                    setNodeSelection({ type: 'source' });
                }}
            ></NodeSelect>
            <NodeSelect
                label='Target'
                displayValue={targetEntity?.name}
                onSelect={() => {
                    showNodeSelectionHelp();
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
            <ActionOkCancel onOk={moveProperty} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
