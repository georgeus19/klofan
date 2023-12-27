import { twMerge } from 'tailwind-merge';
import { getOneToOnePropertyInstances, isOneToOneMappingEligible } from '../../../../core/instances/transform/mapping/one-to-one-mapping';
import { ButtonProps } from './button-props';

export function OneToOneButton({ setEdges, setUsedInstanceMapping, source, target }: ButtonProps) {
    const disabled = !isOneToOneMappingEligible(source.instances.length, target.instances.length);
    return (
        <button
            disabled={disabled}
            onClick={() => {
                setEdges(getOneToOnePropertyInstances(source.instances.length));
                setUsedInstanceMapping({ type: 'one-one', source: source.entity, target: target.entity });
            }}
            className={twMerge('p-1 rounded shadow bg-blue-200 hover:bg-blue-300', disabled ? 'bg-slate-300 hover:bg-slate-300' : '')}
        >
            One-One
        </button>
    );
}
