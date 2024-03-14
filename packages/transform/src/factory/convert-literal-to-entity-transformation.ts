import { ConvertLiteralToEntity } from '@klofan/instances/transform';
import { Schema } from '@klofan/schema';
import { getNewId, identifier } from '@klofan/utils';
import { Transformation } from '../transformation';
import { Literal, Property } from '@klofan/instances/representation';
import { createCreatePropertySetTransformation } from './create-property-set-transformation';
import { createCreateEntitySetTransformation } from './create-entity-set-transformation';
import { Instances } from '@klofan/instances';
import { createDeleteLiteralsTransformation } from './delete-literals-transformation';

export async function createConvertLiteralToNewEntitySetViaNewPropertySetTransformation(
    { schema, instances }: { schema: Schema; instances: Instances },
    data: {
        sourceEntitySetId: identifier;
        newTargetEntitySet: {
            id?: string;
            name?: string;
        };
        newTargetPropertySet: {
            id?: string;
            name?: string;
        };
        literalPropertySetId: identifier;
        literalMapping: {
            from: Literal;
            to: { uri: string };
        }[];
    },
    modifier?: {
        deleteOriginalLiterals?: boolean;
    }
): Promise<Transformation[]> {
    const targetEntitySetId = data.newTargetEntitySet.id ?? getNewId();
    const targetPropertySetId = data.newTargetPropertySet.id ?? getNewId();
    const createEntitySetInstanceTransformation = createCreateEntitySetTransformation({
        schema: {
            name: data.newTargetEntitySet.name ?? 'new-target-entities',
            id: targetEntitySetId,
        },
        instances: {
            instances: data.literalMapping.map((lm) => lm.to),
            count: data.literalMapping.length,
        },
    });

    const schemaAfterCreateEntitySet = schema.transform(
        createEntitySetInstanceTransformation.schemaTransformations
    );
    const instancesAfterCreateEntitySet = await instances.transform(
        createEntitySetInstanceTransformation.instanceTransformations
    );

    const properties: Property[] = [];
    const sourceEntities = await instancesAfterCreateEntitySet.entityCount(
        schemaAfterCreateEntitySet.entitySet(data.sourceEntitySetId)
    );
    for (let i = 0; i < sourceEntities; i++) {
        properties.push({ literals: [], targetEntities: [] });
    }

    const createPropertySetTransformation = createCreatePropertySetTransformation(
        { schema: schemaAfterCreateEntitySet, instances: instancesAfterCreateEntitySet },
        {
            propertySet: {
                id: targetPropertySetId,
                name: data.newTargetPropertySet.name ?? 'new-property',
                value: { type: 'entity-set', entitySetId: targetEntitySetId },
            },
            sourceEntitySetId: data.sourceEntitySetId,
            propertiesMapping: {
                type: 'empty-mapping',
                source: schemaAfterCreateEntitySet.entitySet(data.sourceEntitySetId),
            },
        }
    );

    const schemaAfterCreatePropertySet = schemaAfterCreateEntitySet.transform(
        createPropertySetTransformation.schemaTransformations
    );
    const instancesAfterCreatePropertySet = await instancesAfterCreateEntitySet.transform(
        createPropertySetTransformation.instanceTransformations
    );

    const convertTransformation: ConvertLiteralToEntity = {
        type: 'convert-literal-to-entity',
        data: {
            source: schemaAfterCreatePropertySet.entitySet(data.sourceEntitySetId),
            literalPropertySet: schemaAfterCreatePropertySet.propertySet(data.literalPropertySetId),
            targetPropertySet: schemaAfterCreatePropertySet.propertySet(targetPropertySetId),
            literalMapping: data.literalMapping,
        },
    };
    const modifierTransformations: Transformation[] = [];

    if (modifier && modifier.deleteOriginalLiterals) {
        const deleteLiteralsTransformation = await createDeleteLiteralsTransformation(
            { schema: schemaAfterCreatePropertySet, instances: instancesAfterCreatePropertySet },
            {
                entitySet: schemaAfterCreatePropertySet.entitySet(data.sourceEntitySetId),
                propertySet: schemaAfterCreatePropertySet.propertySet(data.literalPropertySetId),
                literalsToDelete: data.literalMapping.map((lm) => lm.from),
            }
        );
        modifierTransformations.push(deleteLiteralsTransformation);
    }

    return [
        createEntitySetInstanceTransformation,
        createPropertySetTransformation,
        {
            schemaTransformations: [],
            instanceTransformations: [convertTransformation],
        },
        ...modifierTransformations,
    ];
}
