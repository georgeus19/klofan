import * as dataSchema from './term-definitions';
import { rdfType } from '@klofan/utils';
import { DataFactory, Writer } from 'n3';
import { Schema } from '../../schema';
import { getProperties, isEntitySet } from '../../representation/item/entity-set';
import { SaveConfiguration } from '../save-configuration';
import { GraphPropertySet } from '../../representation/relation/graph-property-set';
const { namedNode, literal } = DataFactory;

export function saveAsDataSchema(
    schema: Schema,
    saveConfiguration: SaveConfiguration,
    outputWriter: Writer
) {
    outputWriter.addPrefixes({ ...dataSchema.prefixes });

    schema.entitySets().forEach((entitySet) => {
        const entitySetUri = entitySet.uri
            ? entitySet.uri
            : saveConfiguration.defaultEntitySetUri + entitySet.id;
        outputWriter.addQuad(
            namedNode(entitySetUri),
            namedNode(rdfType),
            namedNode(dataSchema.core.Entity)
        );
    });

    schema.entitySets().forEach((entitySet) => {
        const propertySets = getProperties(schema, entitySet.id);
        const entitySetUri = entitySet.uri
            ? entitySet.uri
            : saveConfiguration.defaultEntitySetUri + entitySet.id;
        const propertySetUri = (propertySet: GraphPropertySet) =>
            propertySet.uri
                ? propertySet.uri
                : saveConfiguration.defaultPropertySetUri + propertySet.id;

        propertySets.forEach((propertySet) => {
            outputWriter.addQuad(
                namedNode(entitySetUri),
                namedNode(dataSchema.core.Property),
                namedNode(propertySetUri(propertySet))
            );
        });

        propertySets.forEach((propertySet) => {
            if (isEntitySet(propertySet.value)) {
                const objectUri = propertySet.value.uri
                    ? propertySet.value.uri
                    : saveConfiguration.defaultEntitySetUri + propertySet.value.id;
                outputWriter.addQuad(
                    namedNode(entitySetUri),
                    namedNode(propertySetUri(propertySet)),
                    namedNode(objectUri)
                );
            } else {
                outputWriter.addQuad(
                    namedNode(entitySetUri),
                    namedNode(propertySetUri(propertySet)),
                    namedNode(saveConfiguration.defaultEntitySetUri + propertySet.value.id)
                );
            }
        });

        propertySets.forEach((propertySet) => {
            outputWriter.addQuad(
                namedNode(propertySetUri(propertySet)),
                namedNode(rdfType),
                namedNode(dataSchema.core.Property)
            );
            outputWriter.addQuad(
                namedNode(propertySetUri(propertySet)),
                namedNode(dataSchema.core.technicalName),
                literal(propertySet.name)
            );
        });
    });
    outputWriter.end();
}
