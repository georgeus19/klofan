import Redis, { RedisOptions } from 'ioredis';

export type DatasetMetadata = { filepath: string; originalFilename: string };

/**
 * Queue for dataset metadata. If there are no data in queue, pop blocks and returns when
 * some data appear. If multiple threads are thus blocked, the longest waiting one get
 * the dataset metadata.
 */
export interface DatasetMetadataBlockingQueue {
    push: (datasets: DatasetMetadata[]) => Promise<void>;
    pop: () => Promise<DatasetMetadata | null>;
}

const DATASET_METADATA_QUEUE = 'dataset-metadata-queue';

export class RedisDatasetMetadataBlockingQueue implements DatasetMetadataBlockingQueue {
    private redis: Redis;
    constructor(options: RedisOptions) {
        this.redis = new Redis(options);
    }

    async push(datasets: DatasetMetadata[]): Promise<void> {
        await this.redis.lpush(
            DATASET_METADATA_QUEUE,
            ...datasets.map((d) => JSON.stringify({ filepath: d.filepath, originalFilename: d.originalFilename }))
        );
    }

    async pop(): Promise<DatasetMetadata> {
        const result = await this.redis.brpop(DATASET_METADATA_QUEUE, 0);
        if (!result) {
            throw new Error(`No element could be popped from ${DATASET_METADATA_QUEUE} or pop timeout expired.`);
        }

        const [_queueName, serializedDatasetInfo] = result;
        return JSON.parse(serializedDatasetInfo) as { filepath: string; originalFilename: string };
    }
}
