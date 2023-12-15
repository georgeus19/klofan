import { isEntity } from '../../core/schema/representation/item/entity';
import { Schema } from '../../core/schema/schema';
import { EntityNode, SchemaNode } from './use-positioning';

export function updateEntityNodes(schemaNodes: SchemaNode[], schema: Schema): SchemaNode[] {
    const nodeIds = new Set(schemaNodes.map((node) => node.data.id));

    const notEntityNodes = schemaNodes.filter((node) => !isEntity(node.data));

    const newNodes: EntityNode[] = schema
        .entities()
        .filter((item) => !nodeIds.has(item.id))
        .map((item) => ({ id: item.id, position: { x: 0, y: 100 }, data: item }));
    const updatedNodes: EntityNode[] = schemaNodes
        .filter((node) => schema.hasEntity(node.data.id))
        .map((node) => ({ ...node, id: schema.entity(node.data.id).id, data: schema.entity(node.data.id) }));

    const entityNodes = [...updatedNodes, ...newNodes].map((node) => {
        node.type = 'entity';
        return node;
    });

    return [...notEntityNodes, ...entityNodes];
}
