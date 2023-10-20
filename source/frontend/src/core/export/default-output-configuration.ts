import { SafeMap } from '../safe-map';
import { Model } from '../state/model';
import { id } from '../state/schema-state';
import { IdentityInstanceUriBuilder } from './instance-uri-identifier-mapping';
import { EntityOutputConfiguration, OutputConfiguration, PropertyOutputConfiguration } from './output-configuration';

const defaultBaseEntityUri = 'http://example.com/entity/';
const defaultBasePropertyUri = 'http://example.com/property/';

/**
 * Create default output configuration.
 * This means taking the data and generating patterned uris for entities and its instances.
 * Uri for entities and properties take default uri base and then the entity/proprty id (with e/p prefix).
 * The instance uri is then {EntityUri}/e{instanceIndex}. Property uris for instances are the same as corresponding schema property uris.
 */
export function createDefaultOutputConfiguration(model: Model): OutputConfiguration {
    const entityUris = new SafeMap<id, EntityOutputConfiguration>(
        model.entities().map((entity) => {
            return [
                entity.id,
                {
                    entity: { uri: `${defaultBaseEntityUri}e${entity.id}` },
                    instances: { baseUri: `${defaultBaseEntityUri}e${entity.id}/`, uriBuilder: new IdentityInstanceUriBuilder() },
                },
            ];
        })
    );
    const propertyUris = new SafeMap<id, PropertyOutputConfiguration>(
        model.properties().map((property) => {
            return [
                property.id,
                {
                    property: { uri: `${defaultBasePropertyUri}p${property.id}`.replaceAll(/\s/g, '_') },
                },
            ];
        })
    );
    return {
        entities: entityUris,
        prefixes: new SafeMap<string, string>([
            ['ex-entity', defaultBaseEntityUri],
            ['ex-property', defaultBasePropertyUri],
        ]),
        properties: propertyUris,
    };
}
