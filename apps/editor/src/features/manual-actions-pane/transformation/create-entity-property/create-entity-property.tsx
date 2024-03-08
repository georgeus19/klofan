import { BipartiteDiagram } from '../../bipartite-diagram/bipartite-diagram';
import { ActionOkCancel } from '../../utils/action-ok-cancel';
import { Header } from '../../utils/header';
import { LabelInput } from '../../utils/general-label-input/label-input';
import { useCreateEntityProperty } from './use-create-entity-property';
import { PropertyEndsNodesSelector } from '../../utils/diagram-node-selection/property-ends-selector/property-ends-nodes-selector';
import { JoinButton } from '../../utils/mapping/join/join-button';
import { OneToAllButton } from '../../utils/mapping/one-to-all-button';
import { OneToOneButton } from '../../utils/mapping/one-to-one-button';
import { AllToOneButton } from '../../utils/mapping/all-to-one-button';
import { ManualButton } from '../../utils/mapping/manual-button';
import { ButtonProps } from '../../utils/mapping/button-props';
import { Entity } from '@klofan/instances';
import { EntitySet } from '@klofan/schema/representation';
import { JoinMappingDetail } from '../../utils/mapping/join/join-mapping-detail';
import { UriLabelInput } from '../../utils/uri/uri-label-input';
import { ErrorMessage } from '../../utils/error-message';

export function CreateEntityProperty() {
    const {
        diagram,
        source,
        target,
        usedInstanceMapping,
        setUsedInstanceMapping,
        propertyEndsSelection,
        property,
        createProperty,
        cancel,
        error,
    } = useCreateEntityProperty();

    const mappingButtonProps: ButtonProps = {
        setEdges: diagram.setEdges,
        setUsedInstanceMapping,
        usedInstanceMapping: usedInstanceMapping,
        source: source as { entitySet: EntitySet; entities: Entity[] },
        target: target as { entitySet: EntitySet; entities: Entity[] },
    };

    return (
        <div>
            <Header label='Create Properties'></Header>
            <LabelInput
                label='Name'
                value={property.name}
                updateValue={property.setName}
                id='name'
                onChangeDone={() => {}}
            ></LabelInput>
            <UriLabelInput
                label='Uri'
                {...property.uri}
                onChangeDone={() => {}}
                usePrefix
                id='uri'
            ></UriLabelInput>
            <div>
                <PropertyEndsNodesSelector
                    {...propertyEndsSelection}
                    sourceEntity={source.entitySet}
                    targetEntity={target.entitySet}
                ></PropertyEndsNodesSelector>
                {source.entitySet && target.entitySet && (
                    <>
                        <div className='text-center p-1 rounded border-2 border-slate-400'>
                            Instance Mapping
                        </div>
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
                        {(usedInstanceMapping.type === 'join-mapping-detail' ||
                            usedInstanceMapping.type === 'join-mapping') && (
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
            <ErrorMessage error={error}></ErrorMessage>
            <ActionOkCancel onOk={createProperty} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
