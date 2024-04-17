import { DataFactory, Writer } from 'n3';
import { Instances } from '../instances';
import { SaveConfiguration } from './save-configuration';
import { safeGet } from '@klofan/utils';
import { getProperties, isEntitySet, isLiteralSet } from '@klofan/schema/representation';
import { Schema } from '@klofan/schema';
import { EntityRepresentationBuilder } from './uri-builders/entity-representation-builder';
import { RDF } from '@klofan/utils';
const { namedNode, literal } = DataFactory;

export async function save(
    instances: Instances,
    schema: Schema,
    saveConfiguration: SaveConfiguration,
    outputWriter: Writer
) {
    for (const subjectEntitySet of schema.entitySets()) {
        const properties = getProperties(schema, subjectEntitySet.id);
        const subjectRepresentationBuilder: EntityRepresentationBuilder = safeGet(
            saveConfiguration.entityRepresentationBuilders,
            subjectEntitySet.id
        );
        for (const subjectEntity of await instances.entities(subjectEntitySet)) {
            const subjectRepresentation = subjectEntity.uri
                ? namedNode(subjectEntity.uri)
                : subjectRepresentationBuilder.getRepresentation(subjectEntity.id);

            // Add types to entity.
            subjectEntitySet.types.map((type) =>
                outputWriter.addQuad(subjectRepresentation, namedNode(RDF.tYPE), namedNode(type))
            );

            for (const propertySet of properties) {
                const objectItem = schema.item(propertySet.value.id);
                const propertyUri = propertySet.uri
                    ? propertySet.uri
                    : `${saveConfiguration.defaultPropertyUri}/${propertySet.id.replaceAll(/\s/g, '_')}`;

                if (isLiteralSet(objectItem)) {
                    safeGet(subjectEntity.properties, propertySet.id).literals.forEach((l) => {
                        outputWriter.addQuad(
                            subjectRepresentation,
                            namedNode(propertyUri),
                            literal(l.value, l.language ?? namedNode(l.type))
                        );
                    });
                }

                if (isEntitySet(objectItem)) {
                    const objectEntities = await instances.entities(objectItem);
                    const objectRepresentationBuilder = safeGet(
                        saveConfiguration.entityRepresentationBuilders,
                        propertySet.value.id
                    );

                    for (const objectEntityIndex of safeGet(
                        subjectEntity.properties,
                        propertySet.id
                    ).targetEntities) {
                        const objectExpliticUri = objectEntities[objectEntityIndex].uri;
                        const objectRepresentation = objectExpliticUri
                            ? namedNode(objectExpliticUri)
                            : objectRepresentationBuilder.getRepresentation(objectEntityIndex);
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
