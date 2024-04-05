import { Schema } from '@klofan/schema';
import { Transformation } from './transformation';
import { Instances } from '@klofan/instances';

export class Transformer {
    constructor(
        private data: Promise<{
            schema: Schema;
            instances: Instances;
            transformations: Transformation[];
        }>
    ) {}

    addTransformStep(
        f: (data: { schema: Schema; instances: Instances }) => Transformation | null
    ): Transformer {
        return new Transformer(
            this.data.then(async ({ schema, instances, transformations }) => {
                const transformation = f({ schema, instances });
                if (!transformation) {
                    return { schema, instances, transformations };
                }
                const newInstances = await instances.transform(
                    transformation.instanceTransformations
                );
                return {
                    schema: schema.transform(transformation.schemaTransformations),
                    instances: newInstances,
                    transformations: [...transformations, transformation],
                };
            })
        );
    }

    transformations(): Promise<Transformation[]> {
        return this.data.then(({ transformations }) => transformations);
    }
}
