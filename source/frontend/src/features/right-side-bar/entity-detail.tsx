import { useState } from 'react';
import { Entity, getProperties, isEntity } from '../../core/schema/representation/item/entity';
import { useSchemaContext } from '../schema-context';
import { createUpdateItemNameTransformation } from '../../core/transform/item-transformation-factory';

import { DetailLabelValueItem } from './detail-label-value-item';
import { createUpdateEntityUriTransformation } from '../../core/transform/entity-transformation-factory';
import { DetailDropdown } from './detail-dropdown';
import { createUpdateRelationNameTransformation } from '../../core/transform/relation-transformation-factory';
import { createUpdatePropertyUriTransformation } from '../../core/transform/property-transformation-factory';
import { isLiteral } from '../../core/schema/representation/item/literal';
import { GraphProperty, toProperty } from '../../core/schema/representation/relation/graph-property';
import { StandaloneInput } from '../standalone-input';
import { useRightSideActionContext } from './right-side-action-context';

export interface EntityDetailProps {
    entity: Entity;
}

export function EntityDetail({ entity }: EntityDetailProps) {
    const [showProperties, setShowProperties] = useState(false);
    const [showInstances, setShowInstances] = useState(false);

    const { showMoveProperty } = useRightSideActionContext();

    const { schema, updateSchema } = useSchemaContext();
    const properties = getProperties(schema, entity.id);
    // console.log('entity', entity);

    const handleEntityNameChange = (name: string) => {
        const transformation = createUpdateItemNameTransformation(schema, entity.id, name);
        updateSchema(transformation.schemaTransformations);
    };

    const handleEntityUriChange = (uri: string) => {
        const transformation = createUpdateEntityUriTransformation(schema, entity.id, uri);
        updateSchema(transformation.schemaTransformations);
    };

    const generatePropertyDetail = (property: GraphProperty) => (
        <li className='border border-slate-300 rounded shadow decoration-double my-1 text-lg' key={property.id}>
            <div className='bg-slate-600 text-white p-1'>{property.name}</div>
            <DetailLabelValueItem
                id={`${property.id}name`}
                label='Name'
                initialValue={property.name}
                onChangeDone={(name: string) => {
                    const transformation = createUpdateRelationNameTransformation(schema, property.id, name);
                    updateSchema(transformation.schemaTransformations);
                }}
            ></DetailLabelValueItem>
            {/* <StandaloneInput
                id={`${property.id}name`}
                className='col-span-8 rounded bg-transparent border-2 border-slate-400 px-1 focus:bg-yellow-200'
                initialValue={property.name}
                onChangeDone={(name: string) => {
                    const transformation = createUpdateRelationNameTransformation(schema, property.id, name);
                    updateSchema(transformation.schemaTransformations);
                }}
            ></StandaloneInput> */}
            <DetailLabelValueItem
                id={`${property.id}uri`}
                label='Uri'
                initialValue={property.uri ?? ''}
                onChangeDone={(uri: string) => {
                    const transformation = createUpdatePropertyUriTransformation(schema, property.id, uri);
                    updateSchema(transformation.schemaTransformations);
                }}
            ></DetailLabelValueItem>
            <button onClick={() => showMoveProperty(entity, toProperty(property))}>Move property</button>
        </li>
    );

    return (
        <div>
            <DetailDropdown headerLabel='General' showInitially={true}>
                <DetailLabelValueItem
                    id='entityName'
                    initialValue={entity.name}
                    onChangeDone={handleEntityNameChange}
                    label='Name'
                ></DetailLabelValueItem>
                <DetailLabelValueItem
                    id='entityUri'
                    initialValue={entity.uri ?? ''}
                    onChangeDone={handleEntityUriChange}
                    label='Uri'
                ></DetailLabelValueItem>
            </DetailDropdown>

            <DetailDropdown headerLabel='Properties' showInitially={false}>
                <DetailDropdown className='mx-2' headerLabel='Literal' showInitially={false}>
                    <ul className='mx-4'>
                        {properties.filter((property) => isLiteral(property.value)).map((property) => generatePropertyDetail(property))}
                    </ul>
                </DetailDropdown>
                <DetailDropdown className='mx-2' headerLabel='Other' showInitially={false}>
                    <ul className='mx-4'>
                        {properties.filter((property) => !isLiteral(property.value)).map((property) => generatePropertyDetail(property))}
                    </ul>
                </DetailDropdown>
            </DetailDropdown>

            <div>
                <div onClick={() => setShowInstances((prev) => !prev)}>Instances</div>
                {showInstances && (
                    <ul>
                        <li>A</li>
                        <li>B</li>
                        <li>C</li>
                    </ul>
                )}
            </div>
        </div>
    );
}
