import { isEntitySet } from '@klofan/schema/representation';
import { Schema } from '@klofan/schema';
import { EntitySetNode, SchemaNode } from '../raw-diagram';
import { ENTITY_SET_NODE } from '../nodes/entity-set-node.tsx';

/**
 * Return updated schema nodes reflecting any changes in schema.
 */
export function reflectEntitySets(schemaNodes: SchemaNode[], schema: Schema): SchemaNode[] {
    const nodeIds = new Set(schemaNodes.map((node) => node.data.id));

    const notEntitySetNodes = schemaNodes.filter((node) => !isEntitySet(node.data));

    const newNodes: EntitySetNode[] = schema
        .entitySets()
        .filter((item) => !nodeIds.has(item.id))
        .map((item) => ({ id: item.id, position: { x: 0, y: 100 }, data: item }));
    const updatedNodes: EntitySetNode[] = schemaNodes
        .filter((node) => schema.hasEntitySet(node.data.id))
        .map((node) => ({
            ...node,
            id: schema.entitySet(node.data.id).id,
            data: schema.entitySet(node.data.id),
        }));

    const entitySetNodes = [...updatedNodes, ...newNodes].map((node) => {
        node.type = ENTITY_SET_NODE;
        return node;
    });

    return [...notEntitySetNodes, ...entitySetNodes];
}
