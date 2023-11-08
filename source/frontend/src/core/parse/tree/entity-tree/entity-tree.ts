import { identifier } from '../../../schema/utils/identifier';
import { SchemaTreeNode } from './schema-tree';
import { getNewId } from '../../../utils/identifier-generator';
import { Tree, isPrimitiveType, primitiveType } from '../tree';

export interface EntityTreeNode {
    literal: boolean;
    name: string;
    id: identifier;
    properties: { [key: identifier]: PropertyInfo };
    instanceCount: number;
}

export interface PropertyInfo {
    id: identifier;
    targetEntity: EntityTreeNode;
    instances: { literals: primitiveType[]; instances: number }[];
}

/**
 * Takes tree like instances(data) and their schema and merges them so that schema entity can reference easily the underlying data.
 * Also adds ids to schema entities and properties.
 */
export function createEntityTree(instanceTree: Tree, schemaTree: SchemaTreeNode): EntityTreeNode {
    const entityTree = convertToEntityTree(schemaTree);
    entityTree.name = 'root';
    const { instances } = parseInstances(fillInstancestoEntityTree(instanceTree, entityTree));
    entityTree.instanceCount += instances;
    return entityTree;
}

function convertToEntityTree(schemaTree: SchemaTreeNode): EntityTreeNode {
    if (isPrimitiveType(schemaTree)) {
        return {
            id: getNewId(),
            literal: true,
            name: '',
            properties: {},
            instanceCount: 0,
        };
    } else {
        const id = getNewId();
        const propertyTargets = Object.entries(schemaTree).map(([propertyName, targetSchemaNode]): [identifier, EntityTreeNode] => [
            propertyName,
            { ...convertToEntityTree(targetSchemaNode), name: propertyName },
        ]);
        const properties = Object.fromEntries(
            propertyTargets.map(([propertyName, targetEntity]) => [
                propertyName,
                {
                    id: getNewId() + `-${propertyName}`,
                    targetEntity: targetEntity,
                    instances: [],
                },
            ])
        );
        return {
            id: id,
            name: '',
            literal: false,
            properties: properties,
            instanceCount: 0,
        };
    }
}

function fillInstancestoEntityTree(instanceTree: Tree, entityTree: EntityTreeNode): (object | primitiveType)[] {
    if (isPrimitiveType(instanceTree)) {
        return [instanceTree];
    } else if (Array.isArray(instanceTree)) {
        return instanceTree.map((instance) => fillInstancestoEntityTree(instance, entityTree)).flat();
    } else {
        Object.entries(entityTree.properties).forEach(([property, propertyInfo]) => {
            if (Object.hasOwn(instanceTree, property)) {
                const { literals, instances } = parseInstances(
                    fillInstancestoEntityTree(instanceTree[property as keyof typeof instanceTree], propertyInfo.targetEntity)
                );

                propertyInfo.instances.push({ literals: literals, instances: instances });
                propertyInfo.targetEntity.instanceCount += instances;
            } else {
                propertyInfo.instances.push({ literals: [], instances: 0 });
            }
        });

        return [{}];
    }
}

function parseInstances(x: (object | primitiveType)[]): { literals: primitiveType[]; instances: number } {
    const literals = x.filter((i): i is primitiveType => isPrimitiveType(i));
    const instances = x.length - literals.length;
    return { literals: literals, instances: instances };
}
