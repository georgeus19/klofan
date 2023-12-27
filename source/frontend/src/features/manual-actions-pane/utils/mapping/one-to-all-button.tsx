import { twMerge } from 'tailwind-merge';
import { getOneToAllPropertyInstances, isOneToAllMappingEligible } from '../../../../core/instances/transform/mapping/one-to-all-mapping';
import { ButtonProps } from './button-props';

export function OneToAllButton({ setEdges, setUsedInstanceMapping, source, target }: ButtonProps) {
    const disabled = !isOneToAllMappingEligible(source.instances.length);
    return (
        <button
            disabled={disabled}
            onClick={() => {
                setEdges(getOneToAllPropertyInstances(target.instances.length));
                setUsedInstanceMapping({ type: 'one-all', source: source.entity, target: target.entity });
            }}
            className={twMerge('p-1 rounded shadow bg-blue-200 hover:bg-blue-300', disabled ? 'bg-slate-300 hover:bg-slate-300' : '')}
        >
            One-All
        </button>
    );
}
