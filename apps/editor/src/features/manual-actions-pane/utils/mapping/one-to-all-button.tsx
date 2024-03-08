import { twMerge } from 'tailwind-merge';
import { getOneToAllProperties, isOneToAllMappingEligible } from '@klofan/instances/transform';
import { ButtonProps } from './button-props';

export function OneToAllButton({
    setEdges,
    setUsedInstanceMapping,
    usedInstanceMapping,
    source,
    target,
}: ButtonProps) {
    const disabled = !isOneToAllMappingEligible(source.entities.length);
    const used = usedInstanceMapping.type === 'one-to-all-mapping';
    return (
        <button
            disabled={disabled}
            onClick={() => {
                setEdges(getOneToAllProperties(target.entities.length));
                setUsedInstanceMapping({
                    type: 'one-to-all-mapping',
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
            One-All
        </button>
    );
}
