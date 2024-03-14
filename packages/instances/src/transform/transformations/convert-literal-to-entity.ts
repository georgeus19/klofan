import { EntitySet, Item, PropertySet } from '@klofan/schema/representation';
import { RawInstances, propertyKey } from '../../representation/raw-instances';
import { Mapping, getProperties } from '../mapping/mapping';
import { TransformationChanges } from '../transformation-changes';
import { Literal } from '../../representation/literal';
import { Entity, EntityReference } from '../../representation/entity';
import * as _ from 'lodash';

export interface ConvertLiteralToEntity {
    type: 'convert-literal-to-entity';
    data: {
        source: EntitySet;
        literalPropertySet: PropertySet;
        targetPropertySet: PropertySet;
        literalMapping: {
            from: Literal;
            to: EntityReference;
        }[];
    };
}

export function convertLiteralToEntity(
    instances: RawInstances,
    {
        data: { source, literalPropertySet, targetPropertySet, literalMapping },
    }: ConvertLiteralToEntity
) {
    const indexLiteralMapping = literalMapping.map((lm) => {
        if (Object.hasOwn(lm.to, 'id')) {
            return { ...lm, to: { id: lm.to.id } };
        }
        if (lm.to.uri) {
            const targetEntity = instances.entities[targetPropertySet.value]
                .map((entity, entityIndex) => ({ entity, entityIndex }))
                .find(({ entity }) => entity.uri === lm.to.uri);
            if (!targetEntity) {
                throw new Error(
                    `Uri ${lm.to.uri} does not match any entity in ${targetPropertySet.value} entity set.`
                );
            }
            return { ...lm, to: { id: targetEntity.entityIndex } };
        }
        throw new Error(`Literal mapping does not contain target entity id or uri.`);
    });

    const targetEntities = instances.properties[propertyKey(source.id, literalPropertySet.id)].map(
        (property, entityIndex) => {
            const targetEntities = property.literals
                .map((literal) => {
                    return indexLiteralMapping.find((lm) => lm.from.value === literal.value);
                })
                .filter((l): l is { from: Literal; to: { id: number } } => l !== undefined)
                .map((l) => l.to);
            return targetEntities.map((targetEntity) => targetEntity.id);
        }
    );
    instances.properties[propertyKey(source.id, targetPropertySet.id)] = instances.properties[
        propertyKey(source.id, targetPropertySet.id)
    ].map((property, entityIndex) => ({
        ...property,
        targetEntities: _.uniq([...property.targetEntities, ...targetEntities[entityIndex]]),
    }));
}

export function convertLiteralToEntityChanges(
    transformation: ConvertLiteralToEntity
): TransformationChanges {
    return {
        entities: [transformation.data.source.id, transformation.data.targetPropertySet.value],
        properties: [
            transformation.data.literalPropertySet.id,
            transformation.data.targetPropertySet.id,
        ],
    };
}
