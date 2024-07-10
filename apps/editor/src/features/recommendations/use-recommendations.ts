import { RawInstances } from '@klofan/instances/representation';
import { IdentifiableRecommendation } from '@klofan/recommender/recommendation';
import { RawSchema } from '@klofan/schema/representation';
import { RawDiagram, SchemaEdge, SchemaNode } from '../diagram/raw-diagram';
import EntitySetNode from './diagram-diff/diagram/entity-set-node.tsx';
import PropertySetEdge from './diagram-diff/diagram/property-set-edge.tsx';
import { useState } from 'react';
import { useEditorContext } from '../editor/editor-context';
import { reflectSchema } from '../diagram/reflect-schema/reflect-schema';
import { Schema } from '@klofan/schema';
import { InMemoryInstances } from '@klofan/instances';
import { NodeChange, applyNodeChanges } from 'reactflow';
import {
    PropertySetSelection,
    usePropertySetSelection,
} from '../diagram/use-property-set-selection.ts';
import {
    TransformationChanges,
    transformationChanges as schemaTransformationChanges,
} from '@klofan/schema/transform';
import { transformationChanges as instancesTransformationChanges } from '@klofan/instances/transform';
import { ENTITY_SET_NODE } from '../diagram/nodes/entity-set-node.tsx';
import { PROPERTY_SET_EDGE } from '../diagram/edges/property-set-edge.tsx';
import { NodeSelection, useNodeSelection } from '../diagram/use-node-selection.ts';
import { TransformSchemaAndInstances } from '../editor/update-operations/transform-schema-and-instances-operation.ts';
import * as _ from 'lodash';

export type RecommendationDiagram = {
    nodes: SchemaNode[];
    edges: SchemaEdge[];
    onNodesChange: (changes: NodeChange[]) => void;
    propertySetSelection: PropertySetSelection;
    nodeSelection: NodeSelection;
};

export type Recommendations = {
    categories: IdentifiableRecommendation['category'][];
    selectCategory: (category: IdentifiableRecommendation['category']) => void;
    selectedRecommendations: {
        category: IdentifiableRecommendation['category'];
        recommendations: IdentifiableRecommendation[];
    };
    recommendationsLoadState: 'loading' | 'loaded' | 'before-load' | 'no-recommendations-yielded';
    getRecommendations: () => Promise<void>;
    deleteRecommendations: () => void;
    applyRecommendation: (recommendation: IdentifiableRecommendation) => Promise<void>;
    showRecommendationDetail: (recommendation: IdentifiableRecommendation) => Promise<void>;
    hideRecommendationDetail: () => void;
    shownRecommendationDetail?: {
        recommendation: IdentifiableRecommendation;
        changes: TransformationChanges;
        old: {
            schema: Schema;
            instances: InMemoryInstances;
            diagram: RecommendationDiagram;
        };
        new: {
            schema: Schema;
            instances: InMemoryInstances;
            diagram: RecommendationDiagram;
        };
    };
};

type RawRecommendationDetail = {
    recommendation: IdentifiableRecommendation;
    changes: TransformationChanges;
    old: {
        schema: RawSchema;
        instances: RawInstances;
        diagram: RawDiagram;
    };
    new: {
        schema: RawSchema;
        instances: RawInstances;
        diagram: RawDiagram;
    };
};

export const nodeTypes = { [ENTITY_SET_NODE]: EntitySetNode };

export const edgeTypes = { [PROPERTY_SET_EDGE]: PropertySetEdge };

export function useRecommendations(): Recommendations {
    const [recommendations, setRecommendations] = useState<{
        [recommenderType: string]: IdentifiableRecommendation[];
    }>({});
    const [selectedCategory, setSelectedCategory] = useState<
        IdentifiableRecommendation['category']
    >({
        name: 'expert',
    });

    const [recommendationsLoadState, setRecommendationsLoadingState] = useState<
        'loading' | 'loaded' | 'before-load' | 'no-recommendations-yielded'
    >('before-load');

    const [selectedRecommendation, setSelectedRecommendation] =
        useState<RawRecommendationDetail | null>(null);
    const { schema, instances, diagram, runOperations } = useEditorContext();
    const oldPropertySetSelection = usePropertySetSelection();
    const newPropertySetSelection = usePropertySetSelection();
    const oldNodeSelection = useNodeSelection();
    const newNodeSelection = useNodeSelection();

    const categories = Object.values(recommendations)
        .filter((rs) => rs.at(0))
        .map((rs) => rs[0].category);

    const selectedRecommendations = {
        category: selectedCategory,
        recommendations: recommendations[selectedCategory.name] ?? [],
    };
    const getRecommendations = (): Promise<void> => {
        deleteRecommendations();
        const url = '/api/v1/recommend';
        const fetchOptions: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                schema: schema.raw(),
                instances: instances.raw(),
            }),
        };

        setRecommendationsLoadingState('loading');

        return fetch(url, fetchOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                const r: IdentifiableRecommendation[] = data;
                if (r.length > 0) {
                    setRecommendationsLoadingState('loaded');
                    setRecommendations(_.groupBy(r, (r) => r.category.name));
                } else {
                    setRecommendationsLoadingState('no-recommendations-yielded');
                    setRecommendations({});
                }
            });
    };

    const deleteRecommendations = () => {
        setRecommendationsLoadingState('before-load');
        setRecommendations({});
        setSelectedRecommendation(null);
        oldPropertySetSelection.clearSelectedPropertySet();
        oldNodeSelection.clearSelectedNode();
        newPropertySetSelection.clearSelectedPropertySet();
        newNodeSelection.clearSelectedNode();
    };

    const showRecommendationDetail = async (recommendation: IdentifiableRecommendation) => {
        const old = {
            schema: schema.raw(),
            instances: instances.raw() as RawInstances,
            diagram: {
                nodes: structuredClone(diagram.nodes),
                edges: structuredClone(diagram.edges),
            },
        };

        let newSchema = schema;
        for (const transformation of recommendation.transformations) {
            newSchema = newSchema.transform(transformation.schemaTransformations);
        }

        let newInstances = instances;
        for (const transformation of recommendation.transformations) {
            newInstances = await newInstances.transform(transformation.instanceTransformations);
        }
        const n = {
            schema: newSchema.raw(),
            instances: newInstances.raw() as RawInstances,
            diagram: reflectSchema(
                { nodes: structuredClone(diagram.nodes), edges: structuredClone(diagram.edges) },
                newSchema
            ),
        };
        const instancesChanges = recommendation.transformations.flatMap((transformation) =>
            transformation.instanceTransformations.map((transformation) =>
                instancesTransformationChanges(transformation)
            )
        );
        const schemaChanges = recommendation.transformations.flatMap((transformation) =>
            transformation.schemaTransformations.map((transformation) =>
                schemaTransformationChanges(transformation)
            )
        );

        const itemChanges = [
            ...instancesChanges.flatMap((ch) => ch.entities),
            ...schemaChanges.flatMap((ch) => ch.items),
        ];
        const relationChanges = [
            ...instancesChanges.flatMap((ch) => ch.properties),
            ...schemaChanges.flatMap((ch) => ch.relations),
        ];

        setSelectedRecommendation({
            recommendation: recommendation,
            changes: {
                items: itemChanges,
                relations: relationChanges,
            },
            old: old,
            new: n,
        });

        oldNodeSelection.clearSelectedNode();
        newNodeSelection.clearSelectedNode();
        oldPropertySetSelection.clearSelectedPropertySet();
        newPropertySetSelection.clearSelectedPropertySet();
    };

    const hideRecommendationDetail = () => {
        setSelectedRecommendation(null);
    };

    const onNodesChange = (oldOrNew: 'new' | 'old') => (changes: NodeChange[]) =>
        setSelectedRecommendation((prev) => {
            if (prev) {
                return {
                    ...prev,
                    [oldOrNew]: {
                        ...prev[oldOrNew],
                        diagram: {
                            ...prev[oldOrNew].diagram,
                            nodes: applyNodeChanges(
                                changes,
                                prev[oldOrNew].diagram.nodes
                            ) as SchemaNode[],
                        },
                    },
                };
            }
            return null;
        });

    const shownRecommendationDetail = selectedRecommendation
        ? {
              recommendation: selectedRecommendation.recommendation,
              changes: selectedRecommendation.changes,
              old: {
                  schema: new Schema(selectedRecommendation.old.schema),
                  instances: new InMemoryInstances(selectedRecommendation.old.instances),
                  diagram: {
                      nodes: selectedRecommendation.old.diagram.nodes,
                      edges: selectedRecommendation.old.diagram.edges,
                      onNodesChange: onNodesChange('old'),
                      propertySetSelection: oldPropertySetSelection,
                      nodeSelection: oldNodeSelection,
                  },
              },
              new: {
                  schema: new Schema(selectedRecommendation.new.schema),
                  instances: new InMemoryInstances(selectedRecommendation.new.instances),
                  diagram: {
                      nodes: selectedRecommendation.new.diagram.nodes,
                      edges: selectedRecommendation.new.diagram.edges,
                      onNodesChange: onNodesChange('new'),
                      propertySetSelection: newPropertySetSelection,
                      nodeSelection: newNodeSelection,
                  },
              },
          }
        : undefined;

    const applyRecommendation = async (recommendation: IdentifiableRecommendation) => {
        const operations: TransformSchemaAndInstances[] = recommendation.transformations.map(
            (transformation) => ({
                type: 'transform-schema-and-instances',
                transformation: transformation,
            })
        );
        await runOperations(operations, true).then(() => {
            deleteRecommendations();
        });
    };

    const selectCategory = (category: IdentifiableRecommendation['category']) => {
        setSelectedCategory(category);
    };

    return {
        categories: categories,
        selectCategory: selectCategory,
        selectedRecommendations: selectedRecommendations,
        recommendationsLoadState,
        getRecommendations,
        deleteRecommendations,
        applyRecommendation,
        showRecommendationDetail,
        hideRecommendationDetail,
        shownRecommendationDetail: shownRecommendationDetail,
    };
}
