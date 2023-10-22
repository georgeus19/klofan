import { Model } from '../state/model';
import { id } from '../state/schema-state';
import { getProperties } from '../state/connected';
import { OutputConfiguration } from './output-configuration';
import * as dataSchema from './data-schema';
import { rdfType } from './rdf-terms';
import { DataFactory, Writer } from 'n3';
import { safeGet } from '../state/state';
const { namedNode, literal } = DataFactory;

/**
 * Export the schema of `model` based on `outputConfiguration` to `outputWriter`.
 */
export function exportSchema(model: Model, outputConfiguration: OutputConfiguration, outputWriter: Writer) {
    outputWriter.addPrefixes({ ...outputConfiguration.prefixes, ...dataSchema.prefixes });

    model
        .entities()
        .filter((entity) => !entity.literal)
        .forEach((entity) => {
            outputWriter.addQuad(
                namedNode(safeGet(outputConfiguration.entities, entity.id).entity.uri),
                namedNode(rdfType),
                namedNode(dataSchema.core.Entity)
            );
        });

    model.entities().forEach((entity) => {
        const properties = getProperties(model, entity.id);
        const entityUri = safeGet(outputConfiguration.entities, entity.id).entity.uri;
        const propertyUri = (id: id) => safeGet(outputConfiguration.properties, id).property.uri;

        properties.forEach((property) => {
            outputWriter.addQuad(namedNode(entityUri), namedNode(dataSchema.core.Property), namedNode(propertyUri(property.id)));
        });

        properties.forEach((property) => {
            const objectUri = safeGet(outputConfiguration.entities, property.value.id).entity.uri;
            outputWriter.addQuad(namedNode(entityUri), namedNode(propertyUri(property.id)), namedNode(objectUri));
        });

        properties.forEach((property) => {
            outputWriter.addQuad(namedNode(propertyUri(property.id)), namedNode(rdfType), namedNode(dataSchema.core.Property));
            outputWriter.addQuad(namedNode(propertyUri(property.id)), namedNode(dataSchema.core.technicalName), literal(property.name));
        });
    });
    outputWriter.end();
}
