import {
    GraphPropertySet,
    toPropertySet,
    isLiteralSet,
    getProperties,
} from '@klofan/schema/representation';
import {
    createUpdateEntityUriTransformation,
    createUpdatePropertyUriTransformation,
    createUpdateRelationNameTransformation,
    createUpdateItemNameTransformation,
} from '@klofan/transform';
import { UncontrollableLabelInput } from '../utils/general-label-input/uncontrollable-label-input';
import { Dropdown } from '../utils/dropdown';
import { useEditorContext } from '../../editor/editor-context';
import { useEntityInstances } from '../utils/use-entity-instances';
import { identifier } from '@klofan/utils';
import { UncontrollableUriLabelInput } from '../utils/uri/uncontrollable-uri-label-input';
import { EntityInstanceView } from '../utils/entity-instance-view';
import { Header } from '../utils/header';

export interface EntityDetailProps {
    entityId: identifier;
}

export function EntityDetail({ entityId }: EntityDetailProps) {
    const { schema, updateSchemaAndInstances, manualActions } = useEditorContext();
    const entity = schema.entitySet(entityId);
    const { entityInstances } = useEntityInstances(entity);

    const propertySets = getProperties(schema, entity.id);

    const handleEntityNameChange = (name: string) => {
        if (name !== entity.name) {
            const transformation = createUpdateItemNameTransformation(schema, entity.id, name);
            updateSchemaAndInstances(transformation);
        }
    };

    const handleEntityUriChange = (uri: string) => {
        const uriNotUpdated = (entity.uri === undefined && uri === '') || entity.uri === uri;
        if (!uriNotUpdated) {
            const transformation = createUpdateEntityUriTransformation(schema, entity.id, uri);
            updateSchemaAndInstances(transformation);
        }
    };

    const generatePropertyDetail = (property: GraphPropertySet) => (
        <li
            className='border border-slate-300 rounded shadow decoration-double my-1'
            key={property.id}
        >
            <div className='bg-slate-500 rounded flex'>
                <div className='grow text-white p-1'>{property.name}</div>
                <button
                    className='self-end p-1 rounded shadow bg-blue-200 hover:bg-blue-300'
                    onClick={() => manualActions.showMoveProperty(entity, toPropertySet(property))}
                >
                    Move
                </button>
            </div>
            <UncontrollableLabelInput
                id={`${property.id}name`}
                label='Name'
                initialValue={property.name}
                onChangeDone={(name: string) => {
                    if (name !== property.name) {
                        const transformation = createUpdateRelationNameTransformation(
                            schema,
                            property.id,
                            name
                        );
                        updateSchemaAndInstances(transformation);
                    }
                }}
            ></UncontrollableLabelInput>
            <UncontrollableUriLabelInput
                id={`${property.id}uri`}
                label='Uri'
                usePrefix
                initialUri={property.uri ?? ''}
                onChangeDone={(uri: string) => {
                    const uriNotUpdated =
                        (property.uri === undefined && uri === '') || property.uri === uri;
                    if (!uriNotUpdated) {
                        const transformation = createUpdatePropertyUriTransformation(
                            schema,
                            property.id,
                            uri
                        );
                        updateSchemaAndInstances(transformation);
                    }
                }}
            ></UncontrollableUriLabelInput>
        </li>
    );

    return (
        <div className='relative'>
            <button className='rounded shadow bg-blue-200 hover:bg-blue-300 p-2 fixed z-50 top-1/2 -translate-y-1/2 -translate-x-1/2 '>
                Detail
            </button>
            <Header label='EntitySet'></Header>
            <Dropdown headerLabel='General' showInitially={true}>
                <UncontrollableLabelInput
                    id='entityName'
                    initialValue={entity.name}
                    onChangeDone={handleEntityNameChange}
                    label='Name'
                ></UncontrollableLabelInput>
                <UncontrollableUriLabelInput
                    id='entityUri'
                    initialUri={entity.uri ?? ''}
                    onChangeDone={handleEntityUriChange}
                    label='Uri'
                    usePrefix
                ></UncontrollableUriLabelInput>
            </Dropdown>

            <Dropdown headerLabel='Properties' showInitially={true}>
                <Dropdown className='mx-2' headerLabel='LiteralSet' showInitially={true}>
                    <ul className='mx-4'>
                        {propertySets
                            .filter((property) => isLiteralSet(property.value))
                            .map((property) => generatePropertyDetail(property))}
                    </ul>
                </Dropdown>
                <Dropdown className='mx-2' headerLabel='EntitySet' showInitially={true}>
                    <ul className='mx-4'>
                        {propertySets
                            .filter((property) => !isLiteralSet(property.value))
                            .map((property) => generatePropertyDetail(property))}
                    </ul>
                </Dropdown>
            </Dropdown>

            {/* <Dropdown headerLabel='Instance' showInitially={true}>
                {entityInstances.map((entityInstance) => {
                    return (
                        <EntityInstanceView
                            key={`${entity.id}.${entityInstance.id}`}
                            entity={entity}
                            entityInstance={entityInstance}
                            showEntityProperties
                            showLiteralProperties
                            className='mt-0 mx-2'
                        ></EntityInstanceView>
                    );
                })}
            </Dropdown> */}
        </div>
    );
}
