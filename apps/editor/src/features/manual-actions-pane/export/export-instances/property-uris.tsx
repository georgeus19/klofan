import { PropertySet, toPropertySet, getProperties } from '@klofan/schema/representation';
import { createUpdatePropertySetUriTransformation } from '@klofan/transform';
import { useEditorContext } from '../../../editor/editor-context';
import { Dropdown } from '../../utils/dropdown';
import { UriLabelInput } from '../../utils/uri/uri-label-input';
import { Uri, validUri } from '../../utils/uri/use-uri-input';
import { UriCard } from './uri-card';

export function PropertyUris({
    className,
    defaultPropertyUri,
}: {
    className?: string;
    defaultPropertyUri: Uri;
}) {
    const { schema, updateSchemaAndInstances } = useEditorContext();
    const entitySets = schema.entitySets();
    const updatePropertySetUri = (propertySet: PropertySet, uri: string) => {
        const uriNotUpdated =
            (propertySet.uri === undefined && uri === '') || propertySet.uri === uri;
        if (!uriNotUpdated) {
            const transformation = createUpdatePropertySetUriTransformation(
                schema,
                propertySet.id,
                uri
            );
            updateSchemaAndInstances(transformation);
        }
    };

    const entityPropertySetPairs = entitySets.flatMap((entitySet) =>
        getProperties(schema, entitySet.id).map((propertySet) => ({
            entitySet: entitySet,
            propertySet: propertySet,
        }))
    );
    return (
        <div className={className}>
            <UriLabelInput
                id='defaultUri'
                label='Default Uri'
                {...defaultPropertyUri}
                usePrefix
            ></UriLabelInput>
            <Dropdown headerLabel='Properties With Invalid Or Missing Uri' showInitially>
                {entityPropertySetPairs
                    .filter(({ propertySet }) => !validUri(propertySet.uri ?? ''))
                    .map(({ entitySet, propertySet }) => (
                        <UriCard
                            key={propertySet.id}
                            id={propertySet.id}
                            label={`${entitySet.name}.${propertySet.name}`}
                            onChangeDone={(uri: string) =>
                                updatePropertySetUri(toPropertySet(propertySet), uri)
                            }
                            uri={propertySet.uri}
                        ></UriCard>
                    ))}
            </Dropdown>
        </div>
    );
}
