import { isEntitySet } from '@klofan/schema/representation';
import { Schema } from '@klofan/schema';
import { EntityNode, SchemaNode } from '../raw-diagram';

export function reflectEntities(schemaNodes: SchemaNode[], schema: Schema): SchemaNode[] {
    const nodeIds = new Set(schemaNodes.map((node) => node.data.id));

    const notEntityNodes = schemaNodes.filter((node) => !isEntitySet(node.data));

    const newNodes: EntityNode[] = schema
        .entitySets()
        .filter((item) => !nodeIds.has(item.id))
        .map((item) => ({ id: item.id, position: { x: 0, y: 100 }, data: item }));
    const updatedNodes: EntityNode[] = schemaNodes
        .filter((node) => schema.hasEntitySet(node.data.id))
        .map((node) => ({
            ...node,
            id: schema.entitySet(node.data.id).id,
            data: schema.entitySet(node.data.id),
        }));

    const entityNodes = [...updatedNodes, ...newNodes].map((node) => {
        node.type = 'entity';
        return node;
    });

    return [...notEntityNodes, ...entityNodes];
}
