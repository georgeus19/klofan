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
import { Dropdown } from '../../utils/dropdown.tsx';
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
import { useEntities } from '../../utils/use-entities.ts';
import { Connection } from 'reactflow';

export interface MoveEntityPropertySetProps {
    entitySet: EntitySet;
    propertySet: PropertySet;
}

export function MoveEntityPropertySet({
    entitySet: originalSourceEntitySet,
    propertySet,
}: MoveEntityPropertySetProps) {
    const {
        schema,
        instances,
        updateSchemaAndInstances,
        help,
        manualActions: { onActionDone },
    } = useEditorContext();

    const originalTargetEntity = schema.entitySet(propertySet.value);

    const { entities: originalSourceInstances } = useEntities(originalSourceEntitySet, instances);
    const { entities: originalTargetInstances } = useEntities(originalTargetEntity, instances);

    const [sourceEntity, setSourceEntity] = useState<EntitySet>(originalSourceEntitySet);
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
        useEntityToEntityDiagram(source, target, propertySet.id);

    const {
        sourceNodes: originalSourceNodes,
        targetNodes: originalTargetNodes,
        edges: originalEdges,
        layout: originalLayout,
    } = useEntityToEntityDiagram(
        { entitySet: originalSourceEntitySet, entities: originalSourceInstances },
        { entitySet: originalTargetEntity, entities: originalTargetInstances },
        propertySet.id
    );
    const [usedPropertiesMapping, setUsedPropertiesMapping] = useState<
        Mapping | JoinMappingDetailMapping
    >({
        type: 'manual-mapping',
        properties: [],
    });

    const moveProperty = () => {
        const transformation = createMovePropertySetTransformation(schema, {
            originalSource: originalSourceEntitySet.id,
            propertySet: propertySet.id,
            newSource: sourceEntity.id,
            newTarget: targetEntity.id,
            propertiesMapping:
                usedPropertiesMapping.type === 'manual-mapping' ||
                usedPropertiesMapping.type === 'join-mapping-detail'
                    ? { type: 'manual-mapping', properties: getPropertyInstances() }
                    : usedPropertiesMapping,
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
        setUsedInstanceMapping: setUsedPropertiesMapping,
        source,
        target,
        usedInstanceMapping: usedPropertiesMapping,
    };

    return (
        <div>
            <Header label='Move PropertySet'></Header>
            <LabelReadonlyInput
                label='PropertySet'
                value={`${originalSourceEntitySet.name}.${propertySet.name}`}
            ></LabelReadonlyInput>
            <Dropdown headerLabel='Original Mapping' showInitially={false}>
                <LabelReadonlyInput
                    label='Original Source'
                    value={originalSourceEntitySet.name}
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
                            entitySet: originalSourceEntitySet,
                            entities: originalSourceInstances,
                        }}
                        originalTarget={{
                            item: originalTargetEntity,
                            entities: originalTargetInstances,
                        }}
                        propertySet={propertySet}
                    ></PreserveButton>
                    <JoinButton
                        {...mappingButtonProps}
                        setUsedInstanceMapping={setUsedPropertiesMapping}
                        usedInstanceMapping={usedPropertiesMapping}
                    ></JoinButton>
                    <OneToAllButton {...mappingButtonProps}></OneToAllButton>
                    <OneToOneButton {...mappingButtonProps}></OneToOneButton>
                    <AllToOneButton {...mappingButtonProps}></AllToOneButton>
                    <ManualButton {...mappingButtonProps}></ManualButton>
                </div>
                {(usedPropertiesMapping.type === 'join-mapping-detail' ||
                    usedPropertiesMapping.type === 'join-mapping') && (
                    <JoinMappingDetail
                        {...mappingButtonProps}
                        setUsedInstanceMapping={setUsedPropertiesMapping}
                        usedInstanceMapping={usedPropertiesMapping}
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
                        setUsedPropertiesMapping({ type: 'manual-mapping', properties: [] });
                        onConnect(connection);
                    }}
                ></BipartiteDiagram>
            </Dropdown>
            <ActionOkCancel onOk={moveProperty} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
