import { useMemo, useState } from 'react';
import { PropertySet, EntitySet } from '@klofan/schema/representation';
import { useEntityToEntityDiagram } from '../bipartite-diagram/hooks/use-entity-to-entity-diagram.ts';
import { BipartiteDiagram } from '../bipartite-diagram/bipartite-diagram';
import EntityInstanceSourceNode from '../bipartite-diagram/nodes/entity-instance-source-node';
import EntityInstanceTargetNode from '../bipartite-diagram/nodes/entity-instance-target-node';
import UpdatableLiteralTargetNode from '../bipartite-diagram/nodes/updatable-literal-target-node';
import { createMovePropertySetTransformation } from '@klofan/transform';
import { ActionOkCancel } from '../utils/action-ok-cancel';
import { Header } from '../utils/header';
import { LabelReadonlyInput } from '../utils/general-label-input/label-readonly-input';
import { useEditorContext } from '../../editor/editor-context';
import { Dropdown } from '../utils/dropdown';
import { usePropertySetEndsNodesSelector } from '../utils/diagram-node-selection/property-ends-selector/use-property-set-ends-nodes-selector.ts';
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
import { useEntities } from '../utils/use-entities.ts';
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
        instances,
        updateSchemaAndInstances,
        help,
        manualActions: { onActionDone },
    } = useEditorContext();

    const originalTargetEntity = schema.entitySet(property.value);

    const { entities: originalSourceInstances } = useEntities(originalSourceEntity, instances);
    const { entities: originalTargetInstances } = useEntities(originalTargetEntity, instances);

    const [sourceEntity, setSourceEntity] = useState<EntitySet>(originalSourceEntity);
    const [targetEntity, setTargetEntity] = useState<EntitySet>(originalTargetEntity);

    const propertyEndsSelector = usePropertySetEndsNodesSelector(
        {
            entitySet: sourceEntity,
            set: (entity: EntitySet) => {
                setSourceEntities([]);
                setSourceEntity(entity);
            },
        },
        {
            entitySet: targetEntity,
            set: (entity: EntitySet) => {
                setTargetEntities([]);
                setTargetEntity(entity);
            },
        }
    );
    const { entities: sourceEntities, setEntities: setSourceEntities } = useEntities(
        sourceEntity,
        instances
    );
    const { entities: targetEntities, setEntities: setTargetEntities } = useEntities(
        targetEntity,
        instances
    );

    const source = { entitySet: sourceEntity, entities: sourceEntities };
    const target = { entitySet: targetEntity, entities: targetEntities };

    const { sourceNodes, targetNodes, edges, setEdges, onConnect, getPropertyInstances, layout } =
        useEntityToEntityDiagram(source, target, property.id);

    const {
        sourceNodes: originalSourceNodes,
        targetNodes: originalTargetNodes,
        edges: originalEdges,
        layout: originalLayout,
    } = useEntityToEntityDiagram(
        { entitySet: originalSourceEntity, entities: originalSourceInstances },
        { entitySet: originalTargetEntity, entities: originalTargetInstances },
        property.id
    );
    const [usedInstanceMapping, setUsedInstanceMapping] = useState<
        Mapping | JoinMappingDetailMapping
    >({
        type: 'manual-mapping',
        properties: [],
    });

    const moveProperty = () => {
        const transformation = createMovePropertySetTransformation(schema, {
            originalSource: originalSourceEntity.id,
            propertySet: property.id,
            newSource: sourceEntity.id,
            newTarget: targetEntity.id,
            instanceMapping:
                usedInstanceMapping.type === 'manual-mapping' ||
                usedInstanceMapping.type === 'join-mapping-detail'
                    ? { type: 'manual-mapping', properties: getPropertyInstances() }
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
                        target={{ item: target.entitySet, entities: target.entities }}
                        originalSource={{
                            entitySet: originalSourceEntity,
                            entities: originalSourceInstances,
                        }}
                        originalTarget={{
                            item: originalTargetEntity,
                            entities: originalTargetInstances,
                        }}
                        propertySet={property}
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
                        setUsedInstanceMapping({ type: 'manual-mapping', properties: [] });
                        onConnect(connection);
                    }}
                ></BipartiteDiagram>
            </Dropdown>
            <ActionOkCancel onOk={moveProperty} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
