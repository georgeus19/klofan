import { PropertyInstance } from '../../../../core/instances/representation/property-instance';
import { Mapping } from '../../../../core/instances/transform/mapping/mapping';

export type ManualButtonProps = {
    setEdges: (propertyInstances: PropertyInstance[]) => void;
    setUsedInstanceMapping: (mapping: Mapping) => void;
};

export function ManualButton({ setEdges, setUsedInstanceMapping }: ManualButtonProps) {
    return (
        <button
            onClick={() => {
                setEdges([]);
                setUsedInstanceMapping({ type: 'manual-mapping', propertyInstances: [] });
            }}
            className='p-1 rounded shadow bg-blue-200 hover:bg-blue-300'
        >
            Manual
        </button>
    );
}
