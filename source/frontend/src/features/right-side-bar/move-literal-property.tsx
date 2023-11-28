import { useEffect, useMemo, useState } from 'react';
import { Entity } from '../../core/schema/representation/item/entity';
import { Property } from '../../core/schema/representation/relation/property';
import { useSchemaContext } from '../schema-context';
import { useNodeSelectionContext } from '../editor';
import { useRightSideActionContext } from './right-side-action-context';
import { useBipartiteEntityLiteralInstanceDiagram } from './bipartite-diagram/use-bipartite-entity-literal-instance-diagram';
import { BipartiteDiagram } from './bipartite-diagram/bipartite-diagram';
import SourceNodeComponent from './bipartite-diagram/source-node';
import LiteralTargetNode from './bipartite-diagram/literal-target-node';
import { NodeSelect } from './node-select';
import { createMovePropertyTransformation } from '../../core/transform/factory/move-property-transformation';
import { useInstancesContext } from '../instances-context';

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
    const { onActionDone } = useRightSideActionContext();

    const { sourceNodes, targetNodes, edges, onConnect, getPropertyInstances, layout } = useBipartiteEntityLiteralInstanceDiagram(
        sourceEntity,
        property.id
    );

    useEffect(() => {
        if (selectedNode && nodeSelection) {
            setSourceEntity(selectedNode.data);

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
    };
    const cancel = () => {
        onActionDone();
    };

    const nodeTypes = useMemo(() => ({ source: SourceNodeComponent, target: LiteralTargetNode, literal: LiteralTargetNode }), []);
    const edgeTypes = useMemo(() => ({}), []);

    return (
        <div>
            <div className='p-2 text-center font-bold bg-slate-300'>Move Property</div>
            <div>
                <div className='grid grid-cols-12 px-3 py-1'>
                    <label className='col-span-4'>Property</label>
                    <input
                        className='col-span-8 rounded bg-transparent border-2 border-slate-400 px-1'
                        type='text'
                        readOnly
                        value={`${entity.name}.${property.name}`}
                    />
                </div>
            </div>
            <div>
                <NodeSelect label='Source' displayValue={sourceEntity?.name} onSelect={() => setNodeSelection(true)}></NodeSelect>
            </div>
            <BipartiteDiagram
                sourceNodes={sourceNodes}
                targetNodes={targetNodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                layout={layout}
                onConnect={onConnect}
            ></BipartiteDiagram>
            <div className='grid grid-cols-12 p-3'>
                <button className='col-start-3 col-span-3 p-2 bg-green-300 shadow rounded hover:bg-green-600 hover:text-white' onClick={moveProperty}>
                    Ok
                </button>
                <button className='col-start-7 col-span-3 p-2 bg-red-300 shadow rounded hover:bg-red-600 hover:text-white' onClick={cancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
}
