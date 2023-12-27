import { twMerge } from 'tailwind-merge';
import { getAllToOnePropertyInstances, isAllToOneMappingEligible } from '../../../../core/instances/transform/mapping/all-to-one-mapping';
import { ButtonProps } from './button-props';

export function AllToOneButton({ setEdges, setUsedInstanceMapping, source, target }: ButtonProps) {
    const disabled = !isAllToOneMappingEligible(target.instances.length);
    return (
        <button
            disabled={disabled}
            onClick={() => {
                setEdges(getAllToOnePropertyInstances(source.instances.length));
                setUsedInstanceMapping({ type: 'all-one', source: source.entity, target: target.entity });
            }}
            className={twMerge('p-1 rounded shadow bg-blue-200 hover:bg-blue-300', disabled ? 'bg-slate-300 hover:bg-slate-300' : '')}
        >
            All-One
        </button>
    );
}
