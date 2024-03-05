import { Logger } from 'winston';

type Options = {
    includeData: boolean;
};

export function logAxiosError(logger: Logger, error: any, message: string, options?: Options) {
    if (error.response) {
        const data = options && options.includeData ? error.response.data : {};
        logger.error(message, {
            data: data,
            status: error.response.status,
            headers: error.response.headers,
        });
    } else if (error.request) {
        logger.error(message, error.request);
    } else {
        logger.error(message, error.message);
    }
}
