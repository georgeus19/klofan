import { twMerge } from 'tailwind-merge';
import { getOneToAllPropertyInstances, isOneToAllMappingEligible } from '@klofan/instances/transform';
import { ButtonProps } from './button-props';

export function OneToAllButton({ setEdges, setUsedInstanceMapping, usedInstanceMapping, source, target }: ButtonProps) {
    const disabled = !isOneToAllMappingEligible(source.instances.length);
    const used = usedInstanceMapping.type === 'one-to-all-mapping';
    return (
        <button
            disabled={disabled}
            onClick={() => {
                setEdges(getOneToAllPropertyInstances(target.instances.length));
                setUsedInstanceMapping({ type: 'one-to-all-mapping', source: source.entity, target: target.entity });
            }}
            className={twMerge(
                'p-1 rounded shadow bg-blue-200 hover:bg-blue-300',
                disabled ? 'bg-slate-300 hover:bg-slate-300' : '',
                used ? 'bg-blue-600 hover:bg-blue-600 text-white' : ''
            )}
        >
            One-All
        </button>
    );
}
