import {
    GraphPropertySet,
    toPropertySet,
    isLiteralSet,
    getProperties,
    isEntitySet,
} from '@klofan/schema/representation';
import {
    createUpdateEntitySetUriTransformation,
    createUpdatePropertySetUriTransformation,
    createUpdateRelationNameTransformation,
    createUpdateItemNameTransformation,
} from '@klofan/transform';
import { UncontrollableLabelInput } from '../utils/general-label-input/uncontrollable-label-input';
import { Dropdown } from '../../utils/dropdown.tsx';
import { useEditorContext } from '../../editor/editor-context';
import { useEntities } from '../../utils/use-entities.ts';
import { identifier } from '@klofan/utils';
import { UncontrollableUriLabelInput } from '../utils/uri/uncontrollable-uri-label-input';
import { Header } from '../utils/header';
import { EntityView } from '../../utils/entity-view.tsx';
import { useRef } from 'react';
import { VirtualList } from '../../utils/virtual-list.tsx';

export interface EntityDetailProps {
    entityId: identifier;
}

export function EntityDetail({ entityId }: EntityDetailProps) {
    const { schema, instances, updateSchemaAndInstances, manualActions } = useEditorContext();
    const entitySet = schema.entitySet(entityId);
    const { entities } = useEntities(entitySet, instances);

    const propertySets = getProperties(schema, entitySet.id);

    const handleEntityNameChange = (name: string) => {
        if (name !== entitySet.name) {
            const transformation = createUpdateItemNameTransformation(schema, entitySet.id, name);
            updateSchemaAndInstances(transformation);
        }
    };

    const handleEntityUriChange = (uri: string) => {
        const uriNotUpdated = (entitySet.uri === undefined && uri === '') || entitySet.uri === uri;
        if (!uriNotUpdated) {
            const transformation = createUpdateEntitySetUriTransformation(
                schema,
                entitySet.id,
                uri
            );
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
                    onClick={() =>
                        manualActions.showMoveProperty(entitySet, toPropertySet(property))
                    }
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
                        const transformation = createUpdatePropertySetUriTransformation(
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
                    initialValue={entitySet.name}
                    onChangeDone={handleEntityNameChange}
                    label='Name'
                ></UncontrollableLabelInput>
                <UncontrollableUriLabelInput
                    id='entityUri'
                    initialUri={entitySet.uri ?? ''}
                    onChangeDone={handleEntityUriChange}
                    label='Uri'
                    usePrefix
                ></UncontrollableUriLabelInput>
            </Dropdown>

            <Dropdown headerLabel='Properties' showInitially={true}>
                <Dropdown className='mx-2' headerLabel='LiteralSet' showInitially={true}>
                    <ul className='mx-4 max-h-96 overflow-auto'>
                        {propertySets
                            .filter((property) => isLiteralSet(property.value))
                            .map((property) => generatePropertyDetail(property))}
                    </ul>
                </Dropdown>
                <Dropdown className='mx-2' headerLabel='EntitySet' showInitially={true}>
                    <ul className='mx-4 max-h-96 overflow-auto'>
                        {propertySets
                            .filter((property) => isEntitySet(property.value))
                            .map((property) => generatePropertyDetail(property))}
                    </ul>
                </Dropdown>
            </Dropdown>

            <Dropdown headerLabel='Entities' showInitially={true}>
                <VirtualList items={entities} height='max-h-160' className='mx-2'>
                    {(entity) => (
                        <EntityView
                            key={entity.id}
                            entitySet={entitySet}
                            entity={entity}
                            schema={schema}
                            showLiteralProperties
                            showEntityProperties
                            expanded
                        ></EntityView>
                    )}
                </VirtualList>

                {/*{entities.map((entityInstance) => {*/}
                {/*    return (*/}
                {/*        <EntityView*/}
                {/*            key={`${entitySet.id}.${entityInstance.id}`}*/}
                {/*            entitySet={entitySet}*/}
                {/*            entity={entityInstance}*/}
                {/*            showEntityProperties*/}
                {/*            showLiteralProperties*/}
                {/*            schema={schema}*/}
                {/*            className='mt-0 mx-2'*/}
                {/*            expanded*/}
                {/*        ></EntityView>*/}
                {/*    );*/}
                {/*})}*/}
            </Dropdown>
        </div>
    );
}
