import { twMerge } from 'tailwind-merge';
import { getAllToOneProperties, isAllToOneMappingEligible } from '@klofan/instances/transform';
import { ButtonProps } from './button-props';

export function AllToOneButton({
    setEdges,
    setUsedInstanceMapping,
    usedInstanceMapping,
    source,
    target,
}: ButtonProps) {
    const disabled = !isAllToOneMappingEligible(target.entities.length);
    const used = usedInstanceMapping.type === 'all-to-one-mapping';
    return (
        <button
            disabled={disabled}
            onClick={() => {
                setEdges(getAllToOneProperties(source.entities.length));
                setUsedInstanceMapping({
                    type: 'all-to-one-mapping',
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
            All-One
        </button>
    );
}
