import { Model } from '../state/model';
import { SchemaState, id } from '../state/schema-state';
import { GraphProperty, getProperties } from '../state/connected';
import { OutputConfiguration } from './output-configuration';
import { doesInstanceHaveLinkToOtherInstances, doesInstanceHaveLiterals, doesInstanceHaveNoProperty } from '../state/instance-state';
import * as dataSchema from './data-schema';
import { rdfType } from './rdf-terms';
import { DataFactory, Writer } from 'n3';
const { namedNode, literal } = DataFactory;

export function exportInstances(model: Model, outputConfiguration: OutputConfiguration, outputWriter: Writer) {
    outputWriter.addPrefixes(Object.fromEntries(outputConfiguration.prefixes.entries()));

    model.entities().forEach((entity) => {
        const properties = getProperties(model, entity.id);
        const subjectEntityBaseUri = outputConfiguration.entityUris.safeGet(entity.id).instancesUri.baseUri;
        const subjectInstanceIdentifierMapping = outputConfiguration.entityUris.safeGet(entity.id).instancesUri.identifierMapping;
        properties.forEach((property) => {
            const objectInstanceIdentifierMapping = outputConfiguration.entityUris.safeGet(property.value.id).instancesUri.identifierMapping;
            const objectInstanceBaseUri = outputConfiguration.entityUris.safeGet(property.value.id).instancesUri.baseUri;

            const propertyUri = outputConfiguration.propertyUris.safeGet(property.id).propertyUri.uri;
            const propertyInstances = model.propertyInstances(entity.id, property.id);
            propertyInstances.forEach((propertyInstance, index) => {
                const subjectInstanceEntityUri = subjectEntityBaseUri + subjectInstanceIdentifierMapping.get(index);
                if (doesInstanceHaveNoProperty(propertyInstance)) {
                    return;
                }

                if (doesInstanceHaveLinkToOtherInstances(propertyInstance)) {
                    propertyInstance.indices
                        .map((instanceIndex) => objectInstanceIdentifierMapping.get(instanceIndex))
                        .forEach((objectUriIdentifier) => {
                            const objectUri = objectInstanceBaseUri + objectUriIdentifier;
                            outputWriter.addQuad(namedNode(subjectInstanceEntityUri), namedNode(propertyUri), namedNode(objectUri));
                        });
                }

                if (doesInstanceHaveLiterals(propertyInstance)) {
                    (!Array.isArray(propertyInstance.value) ? [propertyInstance.value] : propertyInstance.value).forEach((literalValue) => {
                        outputWriter.addQuad(namedNode(subjectInstanceEntityUri), namedNode(propertyUri), literal(literalValue));
                    });
                }
            });
        });
    });
    outputWriter.end();
}

export function exportSchema(model: Model, outputConfiguration: OutputConfiguration, outputWriter: Writer) {
    outputWriter.addPrefixes({ ...Object.fromEntries(outputConfiguration.prefixes.entries()), ...dataSchema.prefixes });

    model
        .entities()
        .filter((entity) => !entity.literal)
        .forEach((entity) => {
            outputWriter.addQuad(
                namedNode(outputConfiguration.entityUris.safeGet(entity.id).entityUri.uri),
                namedNode(rdfType),
                namedNode(dataSchema.core.Entity)
            );
        });

    model.entities().forEach((entity) => {
        const properties = getProperties(model, entity.id);
        const entityUri = outputConfiguration.entityUris.safeGet(entity.id).entityUri.uri;
        const propertyUri = (id: id) => outputConfiguration.propertyUris.safeGet(id).propertyUri.uri;
        properties.forEach((property) => {
            outputWriter.addQuad(namedNode(entityUri), namedNode(dataSchema.core.Property), namedNode(propertyUri(property.id)));
        });
        properties.forEach((property) => {
            const objectUri = outputConfiguration.entityUris.safeGet(property.value.id).entityUri.uri;
            outputWriter.addQuad(namedNode(entityUri), namedNode(propertyUri(property.id)), namedNode(objectUri));
        });

        properties.forEach((property) => {
            outputWriter.addQuad(namedNode(propertyUri(property.id)), namedNode(rdfType), namedNode(dataSchema.core.Property));
            outputWriter.addQuad(namedNode(propertyUri(property.id)), namedNode(dataSchema.core.technicalName), literal(property.name));
        });
    });
    outputWriter.end();
}
