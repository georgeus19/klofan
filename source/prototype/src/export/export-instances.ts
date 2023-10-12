import { Model } from '../state/model';
import { getProperties } from '../state/connected';
import { EntityOutputConfiguration, OutputConfiguration } from './output-configuration';
import { PropertyInstance } from '../state/instance-state';
import { DataFactory, Writer } from 'n3';
const { namedNode, literal } = DataFactory;

/**
 * Export the data(instances) of `model` based on `outputConfiguration` to `outputWriter`.
 */
export function exportInstances(model: Model, outputConfiguration: OutputConfiguration, outputWriter: Writer) {
    outputWriter.addPrefixes(Object.fromEntries(outputConfiguration.prefixes.entries()));

    model.entities().forEach((entity) => {
        const properties = getProperties(model, entity.id);
        const subjectEntityConfiguration = outputConfiguration.entities.safeGet(entity.id);
        properties.forEach((property) => {
            const objectEntityConfiguration = outputConfiguration.entities.safeGet(property.value.id);
            const propertyUri = outputConfiguration.properties.safeGet(property.id).property.uri;

            model.propertyInstances(entity.id, property.id).forEach((propertyInstance, index) => {
                writePropertyInstance(
                    propertyInstance,
                    index,
                    {
                        subjectEntityConfiguration: subjectEntityConfiguration,
                        propertyUri: propertyUri,
                        objectEntityConfiguration: objectEntityConfiguration,
                    },
                    outputWriter
                );
            });
        });
    });
    outputWriter.end();
}

function writePropertyInstance(
    propertyInstance: PropertyInstance,
    instance: number,
    outputConfig: {
        subjectEntityConfiguration: EntityOutputConfiguration;
        propertyUri: string;
        objectEntityConfiguration: EntityOutputConfiguration;
    },
    outputWriter: Writer
) {
    const { subjectEntityConfiguration, propertyUri, objectEntityConfiguration } = outputConfig;
    const subjectInstanceEntityUri = subjectEntityConfiguration.instances.uriBuilder.composeUri(
        subjectEntityConfiguration.instances.baseUri,
        instance
    );

    if (propertyInstance.entities !== undefined) {
        propertyInstance.entities.indices
            .map((instanceIndex) =>
                objectEntityConfiguration.instances.uriBuilder.composeUri(objectEntityConfiguration.instances.baseUri, instanceIndex)
            )
            .forEach((objectUri) => {
                outputWriter.addQuad(namedNode(subjectInstanceEntityUri), namedNode(propertyUri), namedNode(objectUri));
            });
    }

    if (propertyInstance.literals !== undefined) {
        (!Array.isArray(propertyInstance.literals) ? [propertyInstance.literals] : propertyInstance.literals).forEach((literalValue) => {
            outputWriter.addQuad(namedNode(subjectInstanceEntityUri), namedNode(propertyUri), literal(literalValue));
        });
    }
}
