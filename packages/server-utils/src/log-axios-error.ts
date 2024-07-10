import { Logger } from 'winston';

type Options = {
    includeData: boolean;
};

export function processAxiosError(error: any, options?: Options) {
    if (error.response) {
        const data = options && options.includeData ? error.response.data : {};
        return {
            type: 'response-error',
            data: data,
            status: error.response.status,
            headers: error.response.headers,
        };
    } else if (error.request) {
        if (error.code === 'ECONNABORTED') {
            return {
                type: 'request-error',
                message: 'Request timed out (aborted).',
            };
        }
        return {
            type: 'request-error',
            message: (error.message ?? '') + ' - Request sent but no response was received.',
        };
    } else {
        return {
            type: 'weird-error',
            message: error.message,
        };
    }
}

export function logAxiosError(logger: Logger, error: any, message: string, options?: Options) {
    logger.log(message, processAxiosError(error, options));
}
