import { EntitySet, PropertySet } from '@klofan/schema/representation';
import { RawInstances, propertyKey } from '../../representation/raw-instances';
import { Literal } from '../../representation/literal';
import { TransformationChanges } from '../transformation-changes';

export interface UpdatePropertyLiterals {
    type: 'update-property-literals';
    data: {
        entitySet: EntitySet;
        propertySet: PropertySet;
        literals:
            | {
                  type: 'value';
                  from: Literal;
                  to: Literal;
              }
            | {
                  type: 'pattern';
                  matchPattern: string;
                  replacementPattern: string;
                  literalType?: string;
                  literalLanguage?: string;
              };
    };
}

export function updatePropertyLiterals(
    instances: RawInstances,
    transformation: UpdatePropertyLiterals
): void {
    const pk = propertyKey(transformation.data.entitySet.id, transformation.data.propertySet.id);
    const transformationLiterals = transformation.data.literals;
    instances.properties[pk] = instances.properties[pk].map((propertyInstance) => {
        const updatedLiterals = propertyInstance.literals.map((literal) => {
            if (transformationLiterals.type === 'value') {
                return literal.value === transformationLiterals.from.value
                    ? { ...transformationLiterals.to }
                    : literal;
            } else {
                if (literal.value.match(transformationLiterals.matchPattern)) {
                    return {
                        ...literal,
                        value: literal.value.replace(
                            new RegExp(transformationLiterals.matchPattern),
                            transformationLiterals.replacementPattern
                        ),
                        type: transformationLiterals.literalType ?? literal.type,
                        language: transformationLiterals.literalLanguage ?? literal.language,
                    };
                } else {
                    return literal;
                }
            }
        });
        return {
            ...propertyInstance,
            literals: updatedLiterals,
        };
    });
}

export function updatePropertyLiteralsChanges(
    transformation: UpdatePropertyLiterals
): TransformationChanges {
    return {
        entities: [transformation.data.entitySet.id],
        properties: [transformation.data.propertySet.id],
    };
}
