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
import { EntityInstanceView } from '../utils/entity-instance-view';
import { Header } from '../utils/header';

export interface EntityDetailProps {
    entityId: identifier;
}

export function EntityDetail({ entityId }: EntityDetailProps) {
    const { schema, updateSchemaAndInstances, manualActions } = useEditorContext();
    const entity = schema.entity(entityId);
    const { entityInstances } = useEntityInstances(entity);

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
                    className='self-end p-1 rounded shadow bg-blue-200 hover:bg-blue-300'
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
            <Header label='Entity'></Header>
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

            <Dropdown headerLabel='Instance' showInitially={true}>
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
            </Dropdown>
        </div>
    );
}
