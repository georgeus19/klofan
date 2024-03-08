import { useState } from 'react';
import { DisplaySelect } from '../../display-select';
import { useEditorContext } from '../../../../editor/editor-context';
import { PropertySet, EntitySet, isLiteralSet } from '@klofan/schema/representation';
import { JoinMapping, getJoinedProperties } from '@klofan/instances/transform';
import { ButtonProps } from '../button-props';

export type JoinMappingDetailProps = ButtonProps & {
    usedInstanceMapping: JoinMapping | JoinMappingDetailMapping;
    setUsedInstanceMapping: (mapping: JoinMapping | JoinMappingDetailMapping) => void;
};

export type JoinMappingDetailMapping = {
    type: 'join-mapping-detail';
    source: EntitySet;
    sourceJoinPropertySet?: PropertySet;
    target: EntitySet;
    targetJoinPropertySet?: PropertySet;
};

export function JoinMappingDetail({
    usedInstanceMapping,
    setUsedInstanceMapping,
    setEdges,
    source,
    target,
}: JoinMappingDetailProps) {
    const [selectSourceJoinPropertySet, setSelectSourceJoinPropertySet] = useState<boolean>(false);
    const [selectTargetJoinPropertySet, setSelectTargetJoinPropertySet] = useState<boolean>(false);
    const { schema } = useEditorContext();

    const sourcePropertySets = usedInstanceMapping.source.properties
        .map((propertySetId) => schema.propertySet(propertySetId))
        .filter((propertySet) => isLiteralSet(schema.item(propertySet.value)))
        .map((propertySet) => (
            <button
                key={propertySet.id}
                className='p-1 rounded shadow bg-blue-200 hover:bg-blue-300'
                onClick={() => {
                    setSelectSourceJoinPropertySet(false);
                    const newMapping = {
                        ...usedInstanceMapping,
                        sourceJoinPropertySet: propertySet,
                    };
                    setUsedInstanceMapping(newMapping);
                    if (newMapping.targetJoinPropertySet) {
                        setUsedInstanceMapping({
                            ...newMapping,
                            type: 'join-mapping',
                        } as JoinMapping);
                        setEdges(
                            getJoinedProperties(
                                { ...source, joinPropertySet: propertySet },
                                { ...target, joinPropertySet: newMapping.targetJoinPropertySet }
                            )
                        );
                    }
                }}
            >
                {propertySet.name}
            </button>
        ));
    const targetPropertySets = usedInstanceMapping.target.properties
        .map((propertySetId) => schema.propertySet(propertySetId))
        .filter((propertySet) => isLiteralSet(schema.item(propertySet.value)))
        .map((propertySet) => (
            <button
                key={propertySet.id}
                className='p-1 rounded shadow bg-blue-200 hover:bg-blue-300'
                onClick={() => {
                    setSelectTargetJoinPropertySet(false);
                    const newMapping = {
                        ...usedInstanceMapping,
                        targetJoinPropertySet: propertySet,
                    };
                    setUsedInstanceMapping(newMapping);
                    if (newMapping.sourceJoinPropertySet) {
                        setUsedInstanceMapping({
                            ...newMapping,
                            type: 'join-mapping',
                        } as JoinMapping);
                        setEdges(
                            getJoinedProperties(
                                { ...source, joinPropertySet: newMapping.sourceJoinPropertySet },
                                { ...target, joinPropertySet: propertySet }
                            )
                        );
                    }
                }}
            >
                {propertySet.name}
            </button>
        ));
    return (
        <div>
            <div className='text-center'>Join Mapping Properties</div>
            <DisplaySelect
                label='Source'
                displayValue={usedInstanceMapping.sourceJoinPropertySet?.name}
                onSelect={() => {
                    setSelectSourceJoinPropertySet(true);
                }}
            ></DisplaySelect>
            {selectSourceJoinPropertySet && <div>Available properties on source:</div>}
            {selectSourceJoinPropertySet && sourcePropertySets}
            <DisplaySelect
                label='Target'
                displayValue={usedInstanceMapping.targetJoinPropertySet?.name}
                onSelect={() => {
                    setSelectTargetJoinPropertySet(true);
                }}
            ></DisplaySelect>
            {selectTargetJoinPropertySet && <div>Available properties on Target:</div>}
            {selectTargetJoinPropertySet && targetPropertySets}
        </div>
    );
}
