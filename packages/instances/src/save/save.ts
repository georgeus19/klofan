import { DataFactory, Writer } from 'n3';
import { Instances } from '../instances';
import { SaveConfiguration } from './save-configuration';
import { safeGet } from '@klofan/utils';
import { getProperties, isEntitySet, isLiteralSet } from '@klofan/schema/representation';
import { Schema } from '@klofan/schema';
import { EntityInstanceRepresentationBuilder } from './uri-builders/instance-uri-builder';
const { namedNode, literal } = DataFactory;

export async function save(
    instances: Instances,
    schema: Schema,
    saveConfiguration: SaveConfiguration,
    outputWriter: Writer
) {
    for (const subjectEntity of schema.entities()) {
        const properties = getProperties(schema, subjectEntity.id);
        const subjectRepresentationBuilder: EntityInstanceRepresentationBuilder = safeGet(
            saveConfiguration.entityInstanceUriBuilders,
            subjectEntity.id
        );
        for (const subjectInstance of await instances.entityInstances(subjectEntity)) {
            const subjectRepresentation = subjectInstance.uri
                ? namedNode(subjectInstance.uri)
                : subjectRepresentationBuilder.getRepresentation(subjectInstance.id);
            for (const property of properties) {
                const objectItem = schema.item(property.value.id);
                const propertyUri = property.uri
                    ? property.uri
                    : `${saveConfiguration.defaultPropertyUri}/${property.id.replaceAll(/\s/g, '_')}`;

                if (isLiteralSet(objectItem)) {
                    safeGet(subjectInstance.properties, property.id).literals.forEach((l) => {
                        outputWriter.addQuad(
                            subjectRepresentation,
                            namedNode(propertyUri),
                            literal(l.value)
                        );
                    });
                }

                if (isEntitySet(objectItem)) {
                    const objectInstances = await instances.entityInstances(objectItem);
                    const objectRepresentationBuilder = safeGet(
                        saveConfiguration.entityInstanceUriBuilders,
                        property.value.id
                    );

                    for (const objectIndex of safeGet(subjectInstance.properties, property.id)
                        .targetEntities) {
                        const objectExpliticUri = objectInstances[objectIndex].uri;
                        const objectRepresentation = objectExpliticUri
                            ? namedNode(objectExpliticUri)
                            : objectRepresentationBuilder.getRepresentation(objectIndex);
                        outputWriter.addQuad(
                            subjectRepresentation,
                            namedNode(propertyUri),
                            objectRepresentation
                        );
                    }
                }
            }
        }
    }
    outputWriter.end();
}
