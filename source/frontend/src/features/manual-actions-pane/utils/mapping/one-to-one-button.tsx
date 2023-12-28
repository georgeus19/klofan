import { twMerge } from 'tailwind-merge';
import { getOneToOnePropertyInstances, isOneToOneMappingEligible } from '../../../../core/instances/transform/mapping/one-to-one-mapping';
import { ButtonProps } from './button-props';

export function OneToOneButton({ setEdges, setUsedInstanceMapping, usedInstanceMapping, source, target }: ButtonProps) {
    const disabled = !isOneToOneMappingEligible(source.instances.length, target.instances.length);
    const used = usedInstanceMapping.type === 'one-to-one-mapping';
    return (
        <button
            disabled={disabled}
            onClick={() => {
                setEdges(getOneToOnePropertyInstances(source.instances.length));
                setUsedInstanceMapping({ type: 'one-to-one-mapping', source: source.entity, target: target.entity });
            }}
            className={twMerge(
                'p-1 rounded shadow bg-blue-200 hover:bg-blue-300',
                disabled ? 'bg-slate-300 hover:bg-slate-300' : '',
                used ? 'bg-blue-600 hover:bg-blue-600 text-white' : ''
            )}
        >
            One-One
        </button>
    );
}
