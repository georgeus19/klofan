import { useMemo, useState } from 'react';
import { PropertySet, EntitySet } from '@klofan/schema/representation';
import { useEntityInstanceToEntityInstanceDiagram } from '../bipartite-diagram/hooks/use-entity-instance-to-entity-instance-diagram';
import { BipartiteDiagram } from '../bipartite-diagram/bipartite-diagram';
import EntityInstanceSourceNode from '../bipartite-diagram/nodes/entity-instance-source-node';
import EntityInstanceTargetNode from '../bipartite-diagram/nodes/entity-instance-target-node';
import UpdatableLiteralTargetNode from '../bipartite-diagram/nodes/updatable-literal-target-node';
import { createMovePropertyTransformation } from '@klofan/transform';
import { ActionOkCancel } from '../utils/action-ok-cancel';
import { Header } from '../utils/header';
import { LabelReadonlyInput } from '../utils/general-label-input/label-readonly-input';
import { useEditorContext } from '../../editor/editor-context';
import { Dropdown } from '../utils/dropdown';
import { usePropertyEndsNodesSelector } from '../utils/diagram-node-selection/property-ends-selector/use-property-ends-nodes-selector';
import { PropertyEndsNodesSelector } from '../utils/diagram-node-selection/property-ends-selector/property-ends-nodes-selector';
import { Mapping } from '@klofan/instances/transform';
import {
    JoinMappingDetail,
    JoinMappingDetailMapping,
} from '../utils/mapping/join/join-mapping-detail';
import { ButtonProps } from '../utils/mapping/button-props';
import { JoinButton } from '../utils/mapping/join/join-button';
import { OneToAllButton } from '../utils/mapping/one-to-all-button';
import { OneToOneButton } from '../utils/mapping/one-to-one-button';
import { AllToOneButton } from '../utils/mapping/all-to-one-button';
import { ManualButton } from '../utils/mapping/manual-button';
import { PreserveButton } from '../utils/mapping/preserve-button';
import { useEntityInstances } from '../utils/use-entity-instances';
import { Connection } from 'reactflow';

export interface MoveEntityPropertyProps {
    entity: EntitySet;
    property: PropertySet;
}

export function MoveEntityProperty({
    entity: originalSourceEntity,
    property,
}: MoveEntityPropertyProps) {
    const {
        schema,
        updateSchemaAndInstances,
        help,
        manualActions: { onActionDone },
    } = useEditorContext();

    const originalTargetEntity = schema.entitySet(property.value);

    const { entityInstances: originalSourceInstances } = useEntityInstances(originalSourceEntity);
    const { entityInstances: originalTargetInstances } = useEntityInstances(originalTargetEntity);

    const [sourceEntity, setSourceEntity] = useState<EntitySet>(originalSourceEntity);
    const [targetEntity, setTargetEntity] = useState<EntitySet>(originalTargetEntity);

    const propertyEndsSelector = usePropertyEndsNodesSelector(
        {
            entity: sourceEntity,
            set: (entity: EntitySet) => {
                setSourceInstances([]);
                setSourceEntity(entity);
            },
        },
        {
            entity: targetEntity,
            set: (entity: EntitySet) => {
                setTargetInstances([]);
                setTargetEntity(entity);
            },
        }
    );
    const { entityInstances: sourceInstances, setEntityInstances: setSourceInstances } =
        useEntityInstances(sourceEntity);
    const { entityInstances: targetInstances, setEntityInstances: setTargetInstances } =
        useEntityInstances(targetEntity);

    const source = { entity: sourceEntity, instances: sourceInstances };
    const target = { entity: targetEntity, instances: targetInstances };

    const { sourceNodes, targetNodes, edges, setEdges, onConnect, getPropertyInstances, layout } =
        useEntityInstanceToEntityInstanceDiagram(source, target, property.id);

    const {
        sourceNodes: originalSourceNodes,
        targetNodes: originalTargetNodes,
        edges: originalEdges,
        layout: originalLayout,
    } = useEntityInstanceToEntityInstanceDiagram(
        { entity: originalSourceEntity, instances: originalSourceInstances },
        { entity: originalTargetEntity, instances: originalTargetInstances },
        property.id
    );
    const [usedInstanceMapping, setUsedInstanceMapping] = useState<
        Mapping | JoinMappingDetailMapping
    >({
        type: 'manual-mapping',
        propertyInstances: [],
    });

    const moveProperty = () => {
        const transformation = createMovePropertyTransformation(schema, {
            originalSource: originalSourceEntity.id,
            property: property.id,
            newSource: sourceEntity.id,
            newTarget: targetEntity.id,
            instanceMapping:
                usedInstanceMapping.type === 'manual-mapping' ||
                usedInstanceMapping.type === 'join-mapping-detail'
                    ? { type: 'manual-mapping', propertyInstances: getPropertyInstances() }
                    : usedInstanceMapping,
        });
        updateSchemaAndInstances(transformation);
        onActionDone();
        help.hideHelp();
    };
    const cancel = () => {
        onActionDone();
        help.hideHelp();
    };

    const nodeTypes = useMemo(
        () => ({
            source: EntityInstanceSourceNode,
            target: EntityInstanceTargetNode,
            literal: UpdatableLiteralTargetNode,
        }),
        []
    );
    const edgeTypes = useMemo(() => ({}), []);

    const mappingButtonProps: ButtonProps = {
        setEdges,
        setUsedInstanceMapping,
        source,
        target,
        usedInstanceMapping,
    };

    return (
        <div>
            <Header label='Move PropertySet'></Header>
            <LabelReadonlyInput
                label='PropertySet'
                value={`${originalSourceEntity.name}.${property.name}`}
            ></LabelReadonlyInput>
            <Dropdown headerLabel='Original Mapping' showInitially={false}>
                <LabelReadonlyInput
                    label='Original Source'
                    value={originalSourceEntity.name}
                ></LabelReadonlyInput>
                <LabelReadonlyInput
                    label='Original Target'
                    value={originalTargetEntity.name}
                ></LabelReadonlyInput>
                <BipartiteDiagram
                    sourceNodes={originalSourceNodes}
                    targetNodes={originalTargetNodes}
                    edges={originalEdges}
                    layout={originalLayout}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                ></BipartiteDiagram>
            </Dropdown>
            <Dropdown headerLabel='New Mapping' showInitially>
                <PropertyEndsNodesSelector
                    {...propertyEndsSelector}
                    sourceEntity={sourceEntity}
                    targetEntity={targetEntity}
                ></PropertyEndsNodesSelector>
                <div className='text-center p-1 rounded border-2 border-slate-400'>
                    Instance Mapping
                </div>
                <div className='grid grid-cols-3'>
                    <PreserveButton
                        {...mappingButtonProps}
                        target={{ item: target.entity, instances: target.instances }}
                        originalSource={{
                            entity: originalSourceEntity,
                            instances: originalSourceInstances,
                        }}
                        originalTarget={{
                            item: originalTargetEntity,
                            instances: originalTargetInstances,
                        }}
                        property={property}
                    ></PreserveButton>
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
                    sourceNodes={sourceNodes}
                    targetNodes={targetNodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    layout={layout}
                    onConnect={(connection: Connection) => {
                        setUsedInstanceMapping({ type: 'manual-mapping', propertyInstances: [] });
                        onConnect(connection);
                    }}
                ></BipartiteDiagram>
            </Dropdown>
            <ActionOkCancel onOk={moveProperty} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
