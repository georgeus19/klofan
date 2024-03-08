import { twMerge } from 'tailwind-merge';
import { getOneToOneProperties, isOneToOneMappingEligible } from '@klofan/instances/transform';
import { ButtonProps } from './button-props';

export function OneToOneButton({
    setEdges,
    setUsedInstanceMapping,
    usedInstanceMapping,
    source,
    target,
}: ButtonProps) {
    const disabled = !isOneToOneMappingEligible(source.entities.length, target.entities.length);
    const used = usedInstanceMapping.type === 'one-to-one-mapping';
    return (
        <button
            disabled={disabled}
            onClick={() => {
                setEdges(getOneToOneProperties(source.entities.length));
                setUsedInstanceMapping({
                    type: 'one-to-one-mapping',
                    source: source.entitySet,
                    target: target.entitySet,
                });
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
