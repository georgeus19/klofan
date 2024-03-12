import { EntitySet, GraphPropertySet } from '@klofan/schema/representation';
import { ReadonlyInput } from './general-label-input/readonly-input.tsx';
import { Entity } from '@klofan/instances';
import { Property } from '@klofan/instances/representation';

export interface PropertyViewProps {
    property: Property;
    propertySet: GraphPropertySet;
}

export function PropertyView({ property, propertySet }: PropertyViewProps) {
    return (
        <div key={propertySet.id} className='grid grid-cols-2 mx-2'>
            <div className='col-start-1 overflow-auto p-2 bg-slate-300 shadow text-center'>
                {propertySet.name}
            </div>
            {property.literals.map((literal, index) => (
                <div
                    className='col-start-2 overflow-auto p-2 bg-blue-100 text-center'
                    key={`L${literal.value}${index}`}
                >
                    <ReadonlyInput value={literal.value} className='w-full'></ReadonlyInput>
                </div>
            ))}
            {property.targetEntities.map((targetEntityIndex, index) => (
                <div
                    className='col-start-2 overflow-auto p-2 bg-purple-100 text-center shadow'
                    key={`E${index}`}
                >
                    <ReadonlyInput
                        value={`${propertySet.value.name}.${targetEntityIndex}`}
                        className='w-full'
                    ></ReadonlyInput>
                </div>
            ))}
        </div>
    );
}
