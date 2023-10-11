import { SafeMap } from '../safe-map';
import { Model } from '../state/model';
import { id } from '../state/schema-state';
import { IdentityIdentifierMapping } from './instance-uri-identifier-mapping';
import { EntityOutputConfiguration, OutputConfiguration, PropertyOutputConfiguration } from './output-configuration';

export function createDefaultOutputConfiguration(model: Model): OutputConfiguration {
    const entityUris = new SafeMap<id, EntityOutputConfiguration>(
        model.entities().map((entity) => {
            return [
                entity.id,
                {
                    entityUri: { uri: `http://example.com/entity/e${entity.id}` },
                    instancesUri: { baseUri: `http://example.com/entity/e${entity.id}/`, identifierMapping: new IdentityIdentifierMapping() },
                },
            ];
        })
    );
    const propertyUris = new SafeMap<id, PropertyOutputConfiguration>(
        model.properties().map((property) => {
            return [
                property.id,
                {
                    propertyUri: { uri: `http://example.com/property/p${property.id}` },
                },
            ];
        })
    );
    return {
        entityUris: entityUris,
        prefixes: new SafeMap<string, string>([
            ['ex-entity', 'http://example.com/entity/'],
            ['ex-property', 'http://example.com/property/'],
        ]),
        propertyUris: propertyUris,
    };
}
