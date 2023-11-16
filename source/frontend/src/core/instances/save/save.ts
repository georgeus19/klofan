import { DataFactory, Writer } from 'n3';
import { safeGet } from '../../utils/safe-get';
import { Instances } from '../instances';
import { Schema } from '../../schema/schema';
import { getProperties, isEntity } from '../../schema/representation/item/entity';
import { SaveConfiguration } from './save-configuration';
import { isLiteral } from '../../schema/representation/item/literal';
const { namedNode, literal } = DataFactory;

export async function save(instances: Instances, schema: Schema, saveConfiguration: SaveConfiguration, outputWriter: Writer) {
    for (const entity of schema.entities()) {
        const properties = getProperties(schema, entity.id);
        const subjectUriBuilder = safeGet(saveConfiguration.entityInstanceUriBuilders, entity.id);
        for (const property of properties) {
            const objectItem = schema.item(property.value.id);
            const propertyUri = property.uri ? property.uri : `${saveConfiguration.defaultPropertyUri}/${property.id.replaceAll(/\s/g, '_')}`;

            for (const [index, instanceProperty] of (await instances.instanceProperties(entity.id, property.id)).entries()) {
                const subjectInstanceUri = subjectUriBuilder.createUri(index);
                if (isLiteral(objectItem)) {
                    instanceProperty.literals.forEach((l) => {
                        outputWriter.addQuad(namedNode(subjectInstanceUri), namedNode(propertyUri), literal(l.value));
                    });
                }

                if (isEntity(objectItem)) {
                    const objectUriBuilder = safeGet(saveConfiguration.entityInstanceUriBuilders, property.value.id);
                    instanceProperty.targetInstanceIndices
                        .map((instanceIndex) => objectUriBuilder.createUri(instanceIndex))
                        .forEach((objectUri) => {
                            outputWriter.addQuad(namedNode(subjectInstanceUri), namedNode(propertyUri), namedNode(objectUri));
                        });
                }
            }
        }
    }
    outputWriter.end();
}
