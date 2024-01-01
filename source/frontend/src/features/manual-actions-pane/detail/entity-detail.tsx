import { useEffect, useState } from 'react';
import { getProperties } from '../../../core/schema/representation/item/entity';
import { createUpdateItemNameTransformation } from '../../../core/transform/factory/update-item-name-transformation';
import { UncontrollableLabelInput } from '../utils/general-label-input/uncontrollable-label-input';
import { Dropdown } from '../utils/dropdown';
import { createUpdateRelationNameTransformation } from '../../../core/transform/factory/update-relation-name-transformation';
import { createUpdatePropertyUriTransformation } from '../../../core/transform/factory/update-property-uri-transformation';
import { isLiteral } from '../../../core/schema/representation/item/literal';
import { GraphProperty, toProperty } from '../../../core/schema/representation/relation/graph-property';
import { createUpdateEntityUriTransformation } from '../../../core/transform/factory/update-entity-uri-transformation';
import { useEditorContext } from '../../editor/editor-context';
import { useEntityInstances } from '../utils/use-entity-instances';
import { identifier } from '../../../core/schema/utils/identifier';
import { UncontrollableUriLabelInput } from '../utils/uri/uncontrollable-uri-label-input';

export interface EntityDetailProps {
    entityId: identifier;
}

export function EntityDetail({ entityId }: EntityDetailProps) {
    const { schema, updateSchemaAndInstances, manualActions } = useEditorContext();
    const entity = schema.entity(entityId);
    const { entityInstances, setEntityInstances } = useEntityInstances(entity);
    const [usedEntityId, setUsedEntityId] = useState<identifier>(entity.id);
    useEffect(() => {
        setEntityInstances([]);
        setUsedEntityId(entity.id);
    }, [entity]);

    const properties = getProperties(schema, entity.id);

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

    const generatePropertyDetail = (property: GraphProperty) => (
        <li className='border border-slate-300 rounded shadow decoration-double my-1' key={property.id}>
            <div className='bg-slate-500 rounded flex'>
                <div className='grow text-white p-1'>{property.name}</div>
                <button
                    className=' self-end p-1 rounded shadow bg-blue-200 hover:bg-blue-300'
                    onClick={() => manualActions.showMoveProperty(entity, toProperty(property))}
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
                        const transformation = createUpdateRelationNameTransformation(schema, property.id, name);
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
                    const uriNotUpdated = (property.uri === undefined && uri === '') || property.uri === uri;
                    if (!uriNotUpdated) {
                        const transformation = createUpdatePropertyUriTransformation(schema, property.id, uri);
                        updateSchemaAndInstances(transformation);
                    }
                }}
            ></UncontrollableUriLabelInput>
        </li>
    );

    return (
        <div>
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
                <Dropdown className='mx-2' headerLabel='Literal' showInitially={true}>
                    <ul className='mx-4'>
                        {properties.filter((property) => isLiteral(property.value)).map((property) => generatePropertyDetail(property))}
                    </ul>
                </Dropdown>
                <Dropdown className='mx-2' headerLabel='Entity' showInitially={true}>
                    <ul className='mx-4'>
                        {properties.filter((property) => !isLiteral(property.value)).map((property) => generatePropertyDetail(property))}
                    </ul>
                </Dropdown>
            </Dropdown>

            {entity.id === usedEntityId && (
                <Dropdown headerLabel='Instance' showInitially={true}>
                    <div className='flex flex-col'>
                        {entityInstances.map((entityInstance, instanceIndex) => {
                            return (
                                <Dropdown
                                    className='mt-0 mx-2'
                                    headerLabel={`${entity.name}.${instanceIndex}`}
                                    showInitially={false}
                                    key={`${entity.id}${entityInstance.id}`}
                                >
                                    <div className='mx-4 grid grid-cols-3 items-center gap-1'>
                                        <div className='bg-slate-300 overflow-auto p-2 text-center'>
                                            {entity.name}.{instanceIndex}
                                        </div>
                                        {properties
                                            .filter(
                                                (property) =>
                                                    entityInstance.properties[property.id].literals.length > 0 ||
                                                    entityInstance.properties[property.id].targetInstanceIndices.length > 0
                                            )
                                            .map((property) => {
                                                return (
                                                    <div key={property.id} className='contents'>
                                                        <div className='col-start-2 overflow-auto p-2 bg-slate-300 text-center'>{property.name}</div>
                                                        {entityInstance.properties[property.id].literals.map((literal, index) => (
                                                            <div
                                                                className='col-start-3 overflow-auto p-2 bg-blue-300 text-center'
                                                                key={`L${literal.value}${index}`}
                                                            >
                                                                "{literal.value}"
                                                            </div>
                                                        ))}
                                                        {entityInstance.properties[property.id].targetInstanceIndices.map(
                                                            (targetInstanceIndex, index) => (
                                                                <div
                                                                    className='col-start-3 overflow-auto p-2 bg-purple-200 text-center'
                                                                    key={`E${index}`}
                                                                >
                                                                    {property.value.name}.{targetInstanceIndex}
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </Dropdown>
                            );
                        })}
                    </div>
                </Dropdown>
            )}
        </div>
    );
}
