import { useEffect, useMemo, useState } from 'react';
import { Entity } from '../../../core/schema/representation/item/entity';
import { Property } from '../../../core/schema/representation/relation/property';
import { useEntityInstanceToEntityInstanceDiagram } from '../bipartite-diagram/hooks/use-entity-instance-to-entity-instance-diagram';
import { BipartiteDiagram } from '../bipartite-diagram/bipartite-diagram';
import EntityInstanceSourceNode from '../bipartite-diagram/nodes/entity-instance-source-node';
import EntityInstanceTargetNode from '../bipartite-diagram/nodes/entity-instance-target-node';
import UpdatableLiteralTargetNode from '../bipartite-diagram/nodes/updatable-literal-target-node';
import { createMovePropertyTransformation } from '../../../core/transform/factory/move-property-transformation';
import { ActionOkCancel } from '../utils/action-ok-cancel';
import { Header } from '../utils/header';
import { LabelReadonlyInput } from '../utils/label-readonly-input';
import { useEditorContext } from '../../editor/editor-context';
import { Dropdown } from '../utils/dropdown';
import { usePropertyEndsNodesSelector } from '../utils/diagram-node-selection/property-ends-selector/use-property-ends-nodes-selector';
import { PropertyEndsNodesSelector } from '../utils/diagram-node-selection/property-ends-selector/property-ends-nodes-selector';
import { EntityInstance } from '../../../core/instances/entity-instance';
import { Mapping } from '../../../core/instances/transform/mapping/mapping';
import { JoinMappingDetail, JoinMappingDetailMapping } from '../utils/mapping/join/join-mapping-detail';
import { ButtonProps } from '../utils/mapping/button-props';
import { JoinButton } from '../utils/mapping/join/join-button';
import { OneToAllButton } from '../utils/mapping/one-to-all-button';
import { OneToOneButton } from '../utils/mapping/one-to-one-button';
import { AllToOneButton } from '../utils/mapping/all-to-one-button';
import { ManualButton } from '../utils/mapping/manual-button';
import { PreserveButton } from '../utils/mapping/preserve-button';

export interface MoveEntityPropertyProps {
    entity: Entity;
    property: Property;
}

export function MoveEntityProperty({ entity: originalSourceEntity, property }: MoveEntityPropertyProps) {
    const {
        schema,
        instances,
        updateSchemaAndInstances,
        help,
        manualActions: { onActionDone },
    } = useEditorContext();

    const originalTargetEntity = schema.entity(property.value);

    const [originalSourceInstances, setOriginalSourceInstances] = useState<EntityInstance[]>([]);
    const [originalTargetInstances, setOriginalTargetInstances] = useState<EntityInstance[]>([]);
    useEffect(() => {
        instances.entityInstances(originalSourceEntity).then((entityInstances) => setOriginalSourceInstances(entityInstances));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [originalSourceEntity]);
    useEffect(() => {
        instances.entityInstances(originalTargetEntity).then((entityInstances) => setOriginalTargetInstances(entityInstances));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [originalTargetEntity]);

    const [sourceEntity, setSourceEntity] = useState<Entity>(originalSourceEntity);
    const [targetEntity, setTargetEntity] = useState<Entity>(originalTargetEntity);

    const propertyEndsSelector = usePropertyEndsNodesSelector(
        {
            entity: sourceEntity,
            set: (entity: Entity) => {
                setSourceInstances([]);
                setSourceEntity(entity);
            },
        },
        {
            entity: targetEntity,
            set: (entity: Entity) => {
                setTargetInstances([]);
                setTargetEntity(entity);
            },
        }
    );
    const [sourceInstances, setSourceInstances] = useState<EntityInstance[]>([]);
    const [targetInstances, setTargetInstances] = useState<EntityInstance[]>([]);
    useEffect(() => {
        instances.entityInstances(sourceEntity).then((entityInstances) => setSourceInstances(entityInstances));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sourceEntity]);
    useEffect(() => {
        instances.entityInstances(targetEntity).then((entityInstances) => setTargetInstances(entityInstances));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetEntity]);

    const source = { entity: sourceEntity, instances: sourceInstances };
    const target = { entity: targetEntity, instances: targetInstances };

    const { sourceNodes, targetNodes, edges, setEdges, onConnect, getPropertyInstances, layout } = useEntityInstanceToEntityInstanceDiagram(
        source,
        target,
        property.id
    );

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
    const [usedInstanceMapping, setUsedInstanceMapping] = useState<Mapping | JoinMappingDetailMapping>({
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
                usedInstanceMapping.type === 'manual-mapping' || usedInstanceMapping.type === 'join-mapping-detail'
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
        () => ({ source: EntityInstanceSourceNode, target: EntityInstanceTargetNode, literal: UpdatableLiteralTargetNode }),
        []
    );
    const edgeTypes = useMemo(() => ({}), []);

    const mappingButtonProps: ButtonProps = { setEdges, setUsedInstanceMapping, source, target };

    return (
        <div>
            <Header label='Move Property'></Header>
            <LabelReadonlyInput label='Property' value={`${originalSourceEntity.name}.${property.name}`}></LabelReadonlyInput>
            <Dropdown headerLabel='Original Mapping' showInitially={false}>
                <LabelReadonlyInput label='Original Source' value={originalSourceEntity.name}></LabelReadonlyInput>
                <LabelReadonlyInput label='Original Target' value={originalTargetEntity.name}></LabelReadonlyInput>
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
                <div className='text-center p-1 rounded border-2 border-slate-400'>Instance Mapping</div>
                <div className='grid grid-cols-3'>
                    <PreserveButton
                        {...mappingButtonProps}
                        target={{ item: target.entity, instances: target.instances }}
                        originalSource={{ entity: originalSourceEntity, instances: originalSourceInstances }}
                        originalTarget={{ item: originalTargetEntity, instances: originalTargetInstances }}
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
                {(usedInstanceMapping.type === 'join-mapping-detail' || usedInstanceMapping.type === 'join-mapping') && (
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
                    onConnect={onConnect}
                ></BipartiteDiagram>
            </Dropdown>
            <ActionOkCancel onOk={moveProperty} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
