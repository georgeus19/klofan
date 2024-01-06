import { getProperties } from '../../../../core/schema/representation/item/entity';
import { toProperty } from '../../../../core/schema/representation/relation/graph-property';
import { Property } from '../../../../core/schema/representation/relation/property';
import { createUpdatePropertyUriTransformation } from '../../../../core/transform/factory/update-property-uri-transformation';
import { useEditorContext } from '../../../editor/editor-context';
import { Dropdown } from '../../utils/dropdown';
import { UriLabelInput } from '../../utils/uri/uri-label-input';
import { Uri, validUri } from '../../utils/uri/use-uri-input';
import { UriCard } from './uri-card';

export function PropertyUris({ className, defaultPropertyUri }: { className?: string; defaultPropertyUri: Uri }) {
    const { schema, updateSchemaAndInstances } = useEditorContext();
    const entities = schema.entities();
    const updatePropertyUri = (property: Property, uri: string) => {
        const uriNotUpdated = (property.uri === undefined && uri === '') || property.uri === uri;
        if (!uriNotUpdated) {
            const transformation = createUpdatePropertyUriTransformation(schema, property.id, uri);
            updateSchemaAndInstances(transformation);
        }
    };

    const entityPropertyPairs = entities.flatMap((entity) =>
        getProperties(schema, entity.id).map((property) => ({ entity: entity, property: property }))
    );
    return (
        <div className={className}>
            <UriLabelInput id='defaultUri' label='Default Uri' {...defaultPropertyUri} usePrefix></UriLabelInput>
            <Dropdown headerLabel='Properties With Invalid Or Missing Uri' showInitially>
                {entityPropertyPairs
                    .filter(({ property }) => !validUri(property.uri ?? ''))
                    .map(({ entity, property }) => (
                        <UriCard
                            key={property.id}
                            id={property.id}
                            label={`${entity.name}.${property.name}`}
                            onChangeDone={(uri: string) => updatePropertyUri(toProperty(property), uri)}
                            uri={property.uri}
                        ></UriCard>
                    ))}
            </Dropdown>
        </div>
    );
}
