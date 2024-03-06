import { twMerge } from 'tailwind-merge';
import { Property } from '@klofan/instances/representation';
import { Mapping } from '@klofan/instances/transform';
import { JoinMappingDetailMapping } from './join/join-mapping-detail';

export type ManualButtonProps = {
    usedInstanceMapping: Mapping | JoinMappingDetailMapping;
    setEdges: (propertyInstances: Property[]) => void;
    setUsedInstanceMapping: (mapping: Mapping) => void;
};

export function ManualButton({ setEdges, setUsedInstanceMapping, usedInstanceMapping }: ManualButtonProps) {
    const used = usedInstanceMapping.type === 'manual-mapping';
    return (
        <button
            onClick={() => {
                setEdges([]);
                setUsedInstanceMapping({ type: 'manual-mapping', propertyInstances: [] });
            }}
            className={twMerge('p-1 rounded shadow bg-blue-200 hover:bg-blue-300', used ? 'bg-blue-600 hover:bg-blue-600 text-white' : '')}
        >
            Manual
        </button>
    );
}
