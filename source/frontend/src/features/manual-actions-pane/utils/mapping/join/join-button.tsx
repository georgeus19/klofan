import { twMerge } from 'tailwind-merge';
import { Mapping } from '../../../../../core/instances/transform/mapping/mapping';
import { isLiteral } from '../../../../../core/schema/representation/item/literal';
import { useEditorContext } from '../../../../editor/editor-context';
import { ButtonProps } from '../button-props';
import { JoinMappingDetailMapping } from './join-mapping-detail';

export type JoinButtonProps = ButtonProps & {
    setUsedInstanceMapping: (mapping: Mapping | JoinMappingDetailMapping) => void;
    usedInstanceMapping: Mapping | JoinMappingDetailMapping;
};

export function JoinButton({ setEdges, setUsedInstanceMapping, source, target, usedInstanceMapping }: JoinButtonProps) {
    const { schema } = useEditorContext();
    const sourceHasLiterals =
        source.entity.properties.map((propertyId) => schema.property(propertyId)).filter((property) => isLiteral(schema.item(property.value)))
            .length > 0;
    const targetHasLiterals =
        target.entity.properties.map((propertyId) => schema.property(propertyId)).filter((property) => isLiteral(schema.item(property.value)))
            .length > 0;
    const disabled = !sourceHasLiterals || !targetHasLiterals;
    const used = usedInstanceMapping.type === 'join-mapping' || usedInstanceMapping.type === 'join-mapping-detail';
    return (
        <button
            disabled={disabled}
            onClick={() => {
                setEdges([]);
                if (usedInstanceMapping.type === 'join-mapping') {
                    setUsedInstanceMapping({ ...usedInstanceMapping, type: 'join-mapping-detail' });
                } else {
                    setUsedInstanceMapping({ type: 'join-mapping-detail', source: source.entity, target: target.entity });
                }
            }}
            className={twMerge(
                'p-1 rounded shadow bg-blue-200 hover:bg-blue-300',
                disabled ? 'bg-slate-300 hover:bg-slate-300' : '',
                used ? 'bg-blue-600 hover:bg-blue-600 text-white' : ''
            )}
        >
            Join
        </button>
    );
}
