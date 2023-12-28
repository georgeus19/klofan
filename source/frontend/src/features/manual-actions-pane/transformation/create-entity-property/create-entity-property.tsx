import { BipartiteDiagram } from '../../bipartite-diagram/bipartite-diagram';
import { ActionOkCancel } from '../../utils/action-ok-cancel';
import { Header } from '../../utils/header';
import { LabelInput } from '../../utils/label-input';
import { useCreateEntityProperty } from './use-create-entity-property';
import { PropertyEndsNodesSelector } from '../../utils/diagram-node-selection/property-ends-selector/property-ends-nodes-selector';
import { JoinButton } from '../../utils/mapping/join/join-button';
import { OneToAllButton } from '../../utils/mapping/one-to-all-button';
import { OneToOneButton } from '../../utils/mapping/one-to-one-button';
import { AllToOneButton } from '../../utils/mapping/all-to-one-button';
import { ManualButton } from '../../utils/mapping/manual-button';
import { ButtonProps } from '../../utils/mapping/button-props';
import { EntityInstance } from '../../../../core/instances/entity-instance';
import { Entity } from '../../../../core/schema/representation/item/entity';
import { JoinMappingDetail } from '../../utils/mapping/join/join-mapping-detail';

export function CreateEntityProperty() {
    const {
        diagram,
        source,
        target,
        usedInstanceMapping,
        setUsedInstanceMapping,
        propertyEndsSelection,
        propertyName,
        setPropertyName,
        createProperty,
        cancel,
        error,
    } = useCreateEntityProperty();

    const mappingButtonProps: ButtonProps = {
        setEdges: diagram.setEdges,
        setUsedInstanceMapping,
        usedInstanceMapping: usedInstanceMapping,
        source: source as { entity: Entity; instances: EntityInstance[] },
        target: target as { entity: Entity; instances: EntityInstance[] },
    };

    return (
        <div>
            <Header label='Create Entity Property'></Header>
            <LabelInput label='Name' value={propertyName} onChange={(value) => setPropertyName(value)}></LabelInput>
            <div>
                <PropertyEndsNodesSelector
                    {...propertyEndsSelection}
                    sourceEntity={source.entity}
                    targetEntity={target.entity}
                ></PropertyEndsNodesSelector>
                {source.entity && target.entity && (
                    <>
                        <div className='text-center p-1 rounded border-2 border-slate-400'>Instance Mapping</div>
                        <div className='grid grid-cols-5'>
                            <JoinButton
                                {...mappingButtonProps}
                                setUsedInstanceMapping={setUsedInstanceMapping}
                                usedInstanceMapping={usedInstanceMapping}
                            ></JoinButton>
                            <OneToAllButton {...mappingButtonProps}></OneToAllButton>
                            <OneToOneButton {...mappingButtonProps}></OneToOneButton>
                            <AllToOneButton {...mappingButtonProps}></AllToOneButton>
                            <ManualButton {...mappingButtonProps}></ManualButton>
                        </div>
                        {(usedInstanceMapping.type === 'join-mapping-detail' || usedInstanceMapping.type === 'join-mapping') && (
                            <JoinMappingDetail
                                {...mappingButtonProps}
                                setUsedInstanceMapping={setUsedInstanceMapping}
                                usedInstanceMapping={usedInstanceMapping}
                            ></JoinMappingDetail>
                        )}
                        <BipartiteDiagram
                            sourceNodes={diagram.sourceNodes}
                            targetNodes={diagram.targetNodes}
                            edges={diagram.edges}
                            nodeTypes={diagram.nodeTypes}
                            edgeTypes={diagram.edgeTypes}
                            onConnect={diagram.onConnect}
                            layout={diagram.layout}
                        ></BipartiteDiagram>
                    </>
                )}
            </div>
            {error && <div className='bg-rose-200 p-2 border rounded border-rose-700 text-rose-700'>{error}</div>}
            <ActionOkCancel onOk={createProperty} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
