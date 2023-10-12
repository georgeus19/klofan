import { SafeMap } from '../safe-map';
import { Model } from '../state/model';
import { id } from '../state/schema-state';
import { IdentityInstanceUriBuilder } from './instance-uri-identifier-mapping';
import { EntityOutputConfiguration, OutputConfiguration, PropertyOutputConfiguration } from './output-configuration';

export function createDefaultOutputConfiguration(model: Model): OutputConfiguration {
    const entityUris = new SafeMap<id, EntityOutputConfiguration>(
        model.entities().map((entity) => {
            return [
                entity.id,
                {
                    entity: { uri: `http://example.com/entity/e${entity.id}` },
                    instances: { baseUri: `http://example.com/entity/e${entity.id}/`, uriBuilder: new IdentityInstanceUriBuilder() },
                },
            ];
        })
    );
    const propertyUris = new SafeMap<id, PropertyOutputConfiguration>(
        model.properties().map((property) => {
            return [
                property.id,
                {
                    property: { uri: `http://example.com/property/p${property.id}`.replaceAll(/\s/g, '_') },
                },
            ];
        })
    );
    return {
        entities: entityUris,
        prefixes: new SafeMap<string, string>([
            ['ex-entity', 'http://example.com/entity/'],
            ['ex-property', 'http://example.com/property/'],
        ]),
        properties: propertyUris,
    };
}
