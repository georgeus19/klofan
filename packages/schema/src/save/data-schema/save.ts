import * as dataSchema from './term-definitions';
import {rdfType} from '@klofan/utils'
import { DataFactory, Writer } from 'n3';
import { Schema } from '../../schema';
import { getProperties, isEntity } from '../../representation/item/entity';
import { SaveConfiguration } from '../save-configuration';
import { GraphProperty } from '../../representation/relation/graph-property';
const { namedNode, literal } = DataFactory;

export function saveAsDataSchema(schema: Schema, saveConfiguration: SaveConfiguration, outputWriter: Writer) {
    outputWriter.addPrefixes({ ...dataSchema.prefixes });

    schema.entities().forEach((entity) => {
        const entityUri = entity.uri ? entity.uri : saveConfiguration.defaultEntityUri + entity.id;
        outputWriter.addQuad(namedNode(entityUri), namedNode(rdfType), namedNode(dataSchema.core.Entity));
    });

    schema.entities().forEach((entity) => {
        const properties = getProperties(schema, entity.id);
        const entityUri = entity.uri ? entity.uri : saveConfiguration.defaultEntityUri + entity.id;
        const propertyUri = (property: GraphProperty) => (property.uri ? property.uri : saveConfiguration.defaultPropertyUri + property.id);

        properties.forEach((property) => {
            outputWriter.addQuad(namedNode(entityUri), namedNode(dataSchema.core.Property), namedNode(propertyUri(property)));
        });

        properties.forEach((property) => {
            if (isEntity(property.value)) {
                const objectUri = property.value.uri ? property.value.uri : saveConfiguration.defaultEntityUri + property.value.id;
                outputWriter.addQuad(namedNode(entityUri), namedNode(propertyUri(property)), namedNode(objectUri));
            } else {
                outputWriter.addQuad(
                    namedNode(entityUri),
                    namedNode(propertyUri(property)),
                    namedNode(saveConfiguration.defaultEntityUri + property.value.id)
                );
            }
        });

        properties.forEach((property) => {
            outputWriter.addQuad(namedNode(propertyUri(property)), namedNode(rdfType), namedNode(dataSchema.core.Property));
            outputWriter.addQuad(namedNode(propertyUri(property)), namedNode(dataSchema.core.technicalName), literal(property.name));
        });
    });
    outputWriter.end();
}
