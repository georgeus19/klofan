import axios from 'axios';
import { SERVER_ENV } from '@klofan/config/env/server';
import { logAxiosError, ObservabilityTools } from '@klofan/server-utils';

export async function getAnalyses<T>(
    types: [string, ...string[]],
    { logger }: ObservabilityTools
): Promise<T[]> {
    const typesQuery = types.map((type) => `types=${type}`).join('&');
    const { data } = await axios
        .get(`${SERVER_ENV.ANALYSIS_STORE_URL}/api/v1/analyses?${typesQuery}`)
        .catch((error) => {
            logAxiosError(logger, error, `Failed to fetch analyses ${typesQuery}`);
            return { data: [] };
        });
    const analyses: T[] = data;
    return analyses;
}
