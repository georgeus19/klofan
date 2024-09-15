import { Schema } from '@klofan/schema';
import { Instances } from '@klofan/instances';
import { Recommendation } from '@klofan/recommender/recommendation';
import { searchEntitySetInLov, searchPropertySetInLov } from './search-lov';
import { logger } from './main';

export async function recommend({
    schema,
    instances,
}: {
    schema: Schema;
    instances: Instances;
}): Promise<Recommendation[]> {
    logger.info('Recommender request came in.');
    const entitySetRecommendations = Promise.all(
        schema
            .entitySets()
            .map(
                async (entitySet) =>
                    await searchEntitySetInLov({ entitySet }, { schema, instances })
            )
    );

    const propertySetRecommendations = Promise.all(
        schema.propertySets().map(
            async (propertySet) =>
                await searchPropertySetInLov(
                    { propertySet },
                    {
                        schema,
                        instances,
                    }
                )
        )
    );

    const recommendations = [
        ...(await entitySetRecommendations).flat(),
        ...(await propertySetRecommendations).flat(),
    ];
    return recommendations;
}
