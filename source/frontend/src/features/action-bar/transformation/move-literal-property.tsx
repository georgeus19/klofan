import { useEffect, useMemo, useState } from 'react';
import { Entity } from '../../../core/schema/representation/item/entity';
import { Property } from '../../../core/schema/representation/relation/property';
import { useEntityInstanceToLiteralInstanceDiagram } from '../bipartite-diagram/hooks/use-entity-instance-to-literal-instance-diagram';
import { BipartiteDiagram } from '../bipartite-diagram/bipartite-diagram';
import EntityInstanceSourceNode from '../bipartite-diagram/nodes/entity-instance-source-node';
import { NodeSelect } from '../utils/node-select';
import { createMovePropertyTransformation } from '../../../core/transform/factory/move-property-transformation';
import LiteralTargetNode from '../bipartite-diagram/nodes/literal-target-node';
import { ActionOkCancel } from '../utils/action-ok-cancel';
import { Header } from '../utils/header';
import { LabelReadonlyInput } from '../utils/label-readonly-input';
import { useEditorContext } from '../../editor/editor-context';

export interface MoveLiteralPropertyProps {
    entity: Entity;
    property: Property;
}

export function MoveLiteralProperty({ entity, property }: MoveLiteralPropertyProps) {
    const [nodeSelection, setNodeSelection] = useState<boolean>(false);
    const [sourceEntity, setSourceEntity] = useState<Entity>(entity);

    const {
        schema,
        updateSchemaAndInstances,
        diagram: {
            nodeSelection: { selectedNode, clearSelectedNode },
        },
        help,
        manualActions: { onActionDone },
    } = useEditorContext();

    const { sourceNodes, targetNodes, edges, onConnect, getPropertyInstances, layout } = useEntityInstanceToLiteralInstanceDiagram(
        sourceEntity,
        property.id
    );

    useEffect(() => {
        if (selectedNode && nodeSelection) {
            setSourceEntity(selectedNode.data);

            help.showEntityInstanceToLiteralInstanceDiagramHelp();

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
            <LabelReadonlyInput label='Property' value={`${entity.name}.${property.name}`}></LabelReadonlyInput>
            <NodeSelect
                label='Source'
                displayValue={sourceEntity?.name}
                onSelect={() => {
                    help.showNodeSelectionHelp();
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
