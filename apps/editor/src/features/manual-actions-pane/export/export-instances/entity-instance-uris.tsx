import { EntitySet } from '@klofan/schema/representation';
import { createUpdateEntityUriTransformation } from '@klofan/transform';
import { useEditorContext } from '../../../editor/editor-context';
import { Dropdown } from '../../utils/dropdown';
import { validUri } from '../../utils/uri/use-uri-input';
import { UriCard } from './uri-card';

export function EntityInstanceUris({ className }: { className?: string }) {
    const { schema, updateSchemaAndInstances } = useEditorContext();

    const entitySets = schema.entitySets();
    const updateEntityUri = (entity: EntitySet, uri: string) => {
        const uriNotUpdated = (entity.uri === undefined && uri === '') || entity.uri === uri;
        if (!uriNotUpdated) {
            const transformation = createUpdateEntityUriTransformation(schema, entity.id, uri);
            updateSchemaAndInstances(transformation);
        }
    };

    return (
        <div className={className}>
            <Dropdown headerLabel='Blank Nodes' showInitially>
                <div className='flex gap-1 flex-col'>
                    {entitySets
                        .filter((entity) => !entity.uri)
                        .map((entity) => (
                            <UriCard
                                key={entity.id}
                                id={entity.id}
                                label={entity.name}
                                onChangeDone={(uri: string) => updateEntityUri(entity, uri)}
                                uri={entity.uri}
                            ></UriCard>
                        ))}
                </div>
            </Dropdown>
            <Dropdown headerLabel='Entities With Invalid Uri' showInitially>
                <div className='flex gap-1 flex-col'>
                    {entitySets
                        .filter((entity) => entity.uri)
                        .filter((entity) => !validUri(entity.uri ?? ''))
                        .map((entity) => (
                            <UriCard
                                key={entity.id}
                                id={entity.id}
                                label={entity.name}
                                onChangeDone={(uri: string) => updateEntityUri(entity, uri)}
                                uri={entity.uri}
                            ></UriCard>
                        ))}
                </div>
            </Dropdown>
        </div>
    );
}
