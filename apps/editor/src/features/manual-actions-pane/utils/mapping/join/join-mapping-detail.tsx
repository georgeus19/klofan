import { useState } from 'react';
import { DisplaySelect } from '../../display-select';
import { useEditorContext } from '../../../../editor/editor-context';
import { PropertySet, EntitySet, isLiteralSet } from '@klofan/schema/representation';
import { JoinMapping, getJoinedPropertyInstances } from '@klofan/instances/transform';
import { ButtonProps } from '../button-props';

export type JoinMappingDetailProps = ButtonProps & {
    usedInstanceMapping: JoinMapping | JoinMappingDetailMapping;
    setUsedInstanceMapping: (mapping: JoinMapping | JoinMappingDetailMapping) => void;
};

export type JoinMappingDetailMapping = {
    type: 'join-mapping-detail';
    source: EntitySet;
    sourceJoinProperty?: PropertySet;
    target: EntitySet;
    targetJoinProperty?: PropertySet;
};

export function JoinMappingDetail({
    usedInstanceMapping,
    setUsedInstanceMapping,
    setEdges,
    source,
    target,
}: JoinMappingDetailProps) {
    const [selectSourceJoinProperty, setSelectSourceJoinProperty] = useState<boolean>(false);
    const [selectTargetJoinProperty, setSelectTargetJoinProperty] = useState<boolean>(false);
    const { schema } = useEditorContext();

    const sourceProperties = usedInstanceMapping.source.properties
        .map((propertyId) => schema.property(propertyId))
        .filter((property) => isLiteralSet(schema.item(property.value)))
        .map((property) => (
            <button
                key={property.id}
                className='p-1 rounded shadow bg-blue-200 hover:bg-blue-300'
                onClick={() => {
                    setSelectSourceJoinProperty(false);
                    const newMapping = { ...usedInstanceMapping, sourceJoinProperty: property };
                    setUsedInstanceMapping(newMapping);
                    if (newMapping.targetJoinProperty) {
                        setUsedInstanceMapping({
                            ...newMapping,
                            type: 'join-mapping',
                        } as JoinMapping);
                        setEdges(
                            getJoinedPropertyInstances(
                                { ...source, joinProperty: property },
                                { ...target, joinProperty: newMapping.targetJoinProperty }
                            )
                        );
                    }
                }}
            >
                {property.name}
            </button>
        ));
    const targetProperties = usedInstanceMapping.target.properties
        .map((propertyId) => schema.property(propertyId))
        .filter((property) => isLiteralSet(schema.item(property.value)))
        .map((property) => (
            <button
                key={property.id}
                className='p-1 rounded shadow bg-blue-200 hover:bg-blue-300'
                onClick={() => {
                    setSelectTargetJoinProperty(false);
                    const newMapping = { ...usedInstanceMapping, targetJoinProperty: property };
                    setUsedInstanceMapping(newMapping);
                    if (newMapping.sourceJoinProperty) {
                        setUsedInstanceMapping({
                            ...newMapping,
                            type: 'join-mapping',
                        } as JoinMapping);
                        setEdges(
                            getJoinedPropertyInstances(
                                { ...source, joinProperty: newMapping.sourceJoinProperty },
                                { ...target, joinProperty: property }
                            )
                        );
                    }
                }}
            >
                {property.name}
            </button>
        ));
    return (
        <div>
            <div className='text-center'>Join Mapping Properties</div>
            <DisplaySelect
                label='Source'
                displayValue={usedInstanceMapping.sourceJoinProperty?.name}
                onSelect={() => {
                    setSelectSourceJoinProperty(true);
                }}
            ></DisplaySelect>
            {selectSourceJoinProperty && <div>Available properties on source:</div>}
            {selectSourceJoinProperty && sourceProperties}
            <DisplaySelect
                label='Target'
                displayValue={usedInstanceMapping.targetJoinProperty?.name}
                onSelect={() => {
                    setSelectTargetJoinProperty(true);
                }}
            ></DisplaySelect>
            {selectTargetJoinProperty && <div>Available properties on Target:</div>}
            {selectTargetJoinProperty && targetProperties}
        </div>
    );
}
