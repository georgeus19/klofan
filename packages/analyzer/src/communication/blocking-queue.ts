import { DcatDataset } from '@klofan/analyzer/dataset';
import Redis, { RedisOptions } from 'ioredis';
import { AnalysisNotification } from './notification';
import { z, ZodObject } from 'zod';

export type DatasetAnalysisJob = {
    dataset: DcatDataset;
    notifications: AnalysisNotification[];
};


/**
 * Queue for submitting analysis jobs on datasets. If there are no data in queue, pop blocks and returns when
 * some data appear. If multiple threads are thus blocked, the longest waiting one get
 * the dataset.
 */
export interface BlockingQueue<T> {
    push: (items: T[]) => Promise<void>;
    pop: () => Promise<T | null>;
}

export class RedisBlockingQueue<T> implements BlockingQueue<T> {
    private redis: Redis;

    constructor(
        options: RedisOptions,
        private queueName: string,
    ) {
        this.redis = new Redis(options);
    }

    async push(items: T[]): Promise<void> {
        await this.redis.lpush(this.queueName, ...items.map((item) => JSON.stringify(item)));
    }

    async pop(): Promise<T> {
        const result = await this.redis.brpop(this.queueName, 0);
        if (!result) {
            throw new Error(`No element could be popped from ${this.queueName} or pop timeout expired.`);
        }

        const [_queueName, serializedDatasetInfo] = result;
        return JSON.parse(serializedDatasetInfo) as T;
    }
}


// const distributionSchema = () =>
//     z.object({
//         iri: z.string(),
//         mimeType: z.enum(['text/turtle', 'text/csv', 'application/ld+json']),
//         downloadUrl: z.string(),
//         mediaType: z.string(),
//     });
// const requestSchema = z.object({
//     body: z.object({
//         iri: z.string(),
//         distributions: z.tuple([distributionSchema()]).rest(distributionSchema()),
//     }),
// });