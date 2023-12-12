import { useEffect, useMemo, useState } from 'react';
import { Entity } from '../../../core/schema/representation/item/entity';
import { Property } from '../../../core/schema/representation/relation/property';
import { useSchemaContext } from '../../schema-context';
import { useActionContext } from '../action-context';
import { useEntityInstanceToLiteralInstanceDiagram } from '../bipartite-diagram/hooks/use-entity-instance-to-literal-instance-diagram';
import { BipartiteDiagram } from '../bipartite-diagram/bipartite-diagram';
import EntityInstanceSourceNode from '../bipartite-diagram/nodes/entity-instance-source-node';
import { NodeSelect } from '../utils/node-select';
import { createMovePropertyTransformation } from '../../../core/transform/factory/move-property-transformation';
import { useInstancesContext } from '../../instances-context';
import LiteralTargetNode from '../bipartite-diagram/nodes/literal-target-node';
import { useNodeSelectionContext } from '../../diagram/node-selection/node-selection-context';
import { ActionOkCancel } from '../utils/action-ok-cancel';
import { Header } from '../utils/header';
import { LabelReadonlyInput } from '../utils/label-readonly-input';
import { useHelpContext } from '../../help/help-context';

export interface MoveLiteralPropertyProps {
    entity: Entity;
    property: Property;
}

export function MoveLiteralProperty({ entity, property }: MoveLiteralPropertyProps) {
    const { schema, updateSchema } = useSchemaContext();
    const [nodeSelection, setNodeSelection] = useState<boolean>(false);
    const [sourceEntity, setSourceEntity] = useState<Entity>(entity);

    const { updateInstances } = useInstancesContext();
    const { selectedNode, clearSelectedNode } = useNodeSelectionContext();
    const { onActionDone } = useActionContext();
    const { showEntityInstanceToLiteralInstanceDiagramHelp, showNodeSelectionHelp, hideHelp } = useHelpContext();

    const { sourceNodes, targetNodes, edges, onConnect, getPropertyInstances, layout } = useEntityInstanceToLiteralInstanceDiagram(
        sourceEntity,
        property.id
    );

    useEffect(() => {
        if (selectedNode && nodeSelection) {
            setSourceEntity(selectedNode.data);

            showEntityInstanceToLiteralInstanceDiagramHelp();

            clearSelectedNode();
            setNodeSelection(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNode]);

    const moveProperty = () => {
        const transformation = createMovePropertyTransformation(schema, {
            originalSource: entity.id,
            property: property.id,
            newSource: sourceEntity.id,
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

    const nodeTypes = useMemo(() => ({ source: EntityInstanceSourceNode, target: LiteralTargetNode }), []);
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
                    setNodeSelection(true);
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
