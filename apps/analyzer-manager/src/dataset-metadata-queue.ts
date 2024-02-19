import { DcatDataset } from '@klofan/analyzer/dataset';
import Redis, { RedisOptions } from 'ioredis';

export type DatasetMetadata = { filepath: string; originalFilename: string };

/**
 * Queue for dataset metadata. If there are no data in queue, pop blocks and returns when
 * some data appear. If multiple threads are thus blocked, the longest waiting one get
 * the dataset metadata.
 */
export interface DatasetBlockingQueue {
    push: (datasets: DcatDataset[]) => Promise<void>;
    pop: () => Promise<DcatDataset | null>;
}

const DATASET_QUEUE = 'dataset-queue';

export class RedisDatasetBlockingQueue implements DatasetBlockingQueue {
    private redis: Redis;
    constructor(options: RedisOptions) {
        this.redis = new Redis(options);
    }

    async push(datasets: DcatDataset[]): Promise<void> {
        await this.redis.lpush(DATASET_QUEUE, ...datasets.map((d) => JSON.stringify(d)));
    }

    async pop(): Promise<DcatDataset> {
        const result = await this.redis.brpop(DATASET_QUEUE, 0);
        if (!result) {
            throw new Error(`No element could be popped from ${DATASET_QUEUE} or pop timeout expired.`);
        }

        const [_queueName, serializedDatasetInfo] = result;
        return JSON.parse(serializedDatasetInfo) as DcatDataset;
    }
}
