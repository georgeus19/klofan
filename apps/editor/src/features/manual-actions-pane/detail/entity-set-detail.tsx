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
    createUpdateEntitySetTypesTransformation,
    createDeletePropertySetTransformation,
    createDeleteEntitySetTransformation,
} from '@klofan/transform';
import { UncontrollableLabelInput } from '../utils/general-label-input/uncontrollable-label-input';
import { Dropdown } from '../../utils/dropdown.tsx';
import { useEditorContext } from '../../editor/editor-context';
import { useEntities } from '../../utils/use-entities.ts';
import { identifier } from '@klofan/utils';
import { UncontrollableUriLabelInput } from '../utils/uri/uncontrollable-uri-label-input';
import { Header } from '../utils/header';
import { EntityView } from '../../utils/entity-view.tsx';
import { VirtualList } from '../../utils/virtual-list.tsx';
import { useErrorBoundary } from 'react-error-boundary';
import * as _ from 'lodash';
import { EntitySetTypesUpdate } from '../utils/entity-set-types-update.tsx';

export interface EntitySetDetailProps {
    entitySetId: identifier;
}

export function EntitySetDetail({ entitySetId }: EntitySetDetailProps) {
    const { schema, instances, updateSchemaAndInstances, manualActions } = useEditorContext();
    const entitySet = schema.entitySet(entitySetId);
    const { entities } = useEntities(entitySet, instances);
    const { showBoundary } = useErrorBoundary();

    const propertySets = getProperties(schema, entitySet.id);

    const handleEntityNameChange = (name: string) => {
        if (name !== entitySet.name) {
            const transformation = createUpdateItemNameTransformation(schema, entitySet.id, name);
            updateSchemaAndInstances(transformation).catch((error) => showBoundary(error));
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
            updateSchemaAndInstances(transformation).catch((error) => showBoundary(error));
        }
    };

    const handleEntityTypesChange = (newTypes: string[]) => {
        const typesNotUpdated = _.isEqual(_.sortBy(entitySet.types), _.sortBy(newTypes));
        if (!typesNotUpdated) {
            const transformation = createUpdateEntitySetTypesTransformation(
                { schema },
                { entitySetId: entitySet.id, types: newTypes }
            );
            updateSchemaAndInstances(transformation).catch((error) => showBoundary(error));
        }
    };

    const generatePropertyDetail = (property: GraphPropertySet) => (
        <div
            className='border border-slate-300 rounded shadow decoration-double my-1'
            key={property.id}
        >
            <div className='bg-slate-500 rounded flex gap-1'>
                <div className='grow text-white p-1 m-1'>{property.name}</div>
                <div className='self-end grid grid-cols-3 gap-1 m-1'>
                    {isLiteralSet(property.value) && (
                        <button
                            className='p-1 rounded shadow bg-blue-200 hover:bg-blue-300'
                            onClick={() => {
                                manualActions.showUpdateLiterals(
                                    entitySet,
                                    toPropertySet(property)
                                );
                            }}
                        >
                            Update
                        </button>
                    )}
                    <button
                        className='p-1 rounded shadow bg-blue-200 hover:bg-blue-300 col-start-2'
                        onClick={() =>
                            manualActions.showMoveProperty(entitySet, toPropertySet(property))
                        }
                    >
                        Move
                    </button>
                    <button
                        className='p-1 rounded shadow bg-blue-200 hover:bg-blue-300 col-start-3'
                        onClick={() => {
                            const transformation = createDeletePropertySetTransformation(
                                { schema, instances },
                                { entitySetId: entitySet.id, propertySetId: property.id }
                            );
                            updateSchemaAndInstances(transformation).catch((error) =>
                                showBoundary(error)
                            );
                        }}
                    >
                        Delete
                    </button>
                </div>
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
                        updateSchemaAndInstances(transformation).catch((error) =>
                            showBoundary(error)
                        );
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
                        updateSchemaAndInstances(transformation).catch((error) =>
                            showBoundary(error)
                        );
                    }
                }}
            ></UncontrollableUriLabelInput>
        </div>
    );

    return (
        <div className='relative'>
            {/*<button className='rounded shadow bg-blue-200 hover:bg-blue-300 p-2 fixed z-50 top-1/2 -translate-y-1/2 -translate-x-1/2 '>*/}
            {/*    Detail*/}
            {/*</button>*/}
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
            <Dropdown headerLabel='Types' showInitially={true}>
                <EntitySetTypesUpdate
                    entitySet={entitySet}
                    onTypesChange={handleEntityTypesChange}
                ></EntitySetTypesUpdate>
            </Dropdown>
            <Dropdown headerLabel='Operations' showInitially={false}>
                <div className='grid grid-cols-1'>
                    <button
                        className='self-end p-1 rounded shadow bg-blue-200 hover:bg-blue-300'
                        onClick={() => {
                            const transformation = createDeleteEntitySetTransformation(
                                { schema, instances },
                                { entitySetId: entitySet.id }
                            );
                            manualActions.hide();
                            updateSchemaAndInstances(transformation).catch((error) =>
                                showBoundary(error)
                            );
                        }}
                    >
                        Delete
                    </button>
                </div>
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
