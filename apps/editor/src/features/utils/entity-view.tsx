import { Entity } from '@klofan/instances';
import { isLiteralSet, EntitySet, getProperties, isEntitySet } from '@klofan/schema/representation';
import { useEditorContext } from '../../editor/editor-context';
import { Dropdown } from './dropdown';
import { ReadonlyInput } from './general-label-input/readonly-input';
import { LabelReadonlyUriInput } from './uri/label-readonly-uri-input';
import { Schema } from '@klofan/schema';
import { PropertyView } from './property-view.tsx';

export type EntityViewProps = {
    entitySet: EntitySet;
    entity: Entity;
    showLiteralProperties?: boolean;
    showEntityProperties?: boolean;
    className?: string;
    schema: Schema;
    expanded: boolean;
};

export function EntityView({
    entitySet,
    entity,
    showEntityProperties,
    showLiteralProperties,
    className,
    schema,
    expanded,
}: EntityViewProps) {
    const instance = getProperties(schema, entitySet.id)
        .filter((propertySet) => showEntityProperties || isLiteralSet(propertySet.value))
        .filter((propertySet) => showLiteralProperties || isEntitySet(propertySet.value))
        .filter(
            (propertySet) =>
                entity.properties[propertySet.id].literals.length > 0 ||
                entity.properties[propertySet.id].targetEntities.length > 0
        )
        .map((propertySet) => {
            return (
                <PropertyView
                    property={entity.properties[propertySet.id]}
                    propertySet={propertySet}
                ></PropertyView>
            );
            // return (
            //     <div key={propertySet.id} className='grid grid-cols-2 mx-2'>
            //         <div className='col-start-1 overflow-auto p-2 bg-slate-300 shadow text-center'>
            //             {propertySet.name}
            //         </div>
            //         {entity.properties[propertySet.id].literals.map((literal, index) => (
            //             <div
            //                 className='col-start-2 overflow-auto p-2 bg-blue-100 text-center'
            //                 key={`L${literal.value}${index}`}
            //             >
            //                 <ReadonlyInput value={literal.value} className='w-full'></ReadonlyInput>
            //             </div>
            //         ))}
            //         {entity.properties[propertySet.id].targetEntities.map(
            //             (targetEntityIndex, index) => (
            //                 <div
            //                     className='col-start-2 overflow-auto p-2 bg-purple-100 text-center shadow'
            //                     key={`E${index}`}
            //                 >
            //                     <ReadonlyInput
            //                         value={`${propertySet.value.name}.${targetEntityIndex}`}
            //                         className='w-full'
            //                     ></ReadonlyInput>
            //                 </div>
            //             )
            //         )}
            //     </div>
            // );
        });

    const header = (
        <div>
            {entitySet.name}.{entity.id} {entity.uri}
        </div>
    );

    return (
        <div className={className}>
            <Dropdown headerLabel={header} showInitially={expanded}>
                <LabelReadonlyUriInput
                    label='Uri'
                    uri={entity.uri ?? ''}
                    className='col-span-2'
                ></LabelReadonlyUriInput>
                {instance}
            </Dropdown>
        </div>
    );
}
