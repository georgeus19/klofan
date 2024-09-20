import winston from 'winston';
import 'winston-mongodb';
import LokiTransport from 'winston-loki';
import { SERVER_ENV } from '../env/server';

export const createLogger = (options: {
    serviceName: string;
    workflow: 'ANALYZE' | 'RECOMMEND' | 'STORE';
}) => {
    const logger = winston.createLogger({
        transports: [
            new LokiTransport({
                host: SERVER_ENV.LOKI_URL,
                labels: {
                    service_name: options.serviceName,
                    workflow: options.workflow,
                },
            }),
            new winston.transports.Console({
                format: winston.format.prettyPrint(),
            }),
        ],
    });

    return logger;
};
