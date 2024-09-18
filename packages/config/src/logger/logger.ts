import winston from 'winston';
import 'winston-mongodb';
import LokiTransport from 'winston-loki';
import { SERVER_ENV } from '../env/server';

export const createLogger = (options: {
    serviceName: string;
    workflow: 'ANALYZE' | 'RECOMMEND' | 'STORE';
}) => {
    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.metadata()
        ),
        transports: [
            new LokiTransport({
                host: SERVER_ENV.LOKI_URL,
                labels: {
                    serviceName: options.serviceName,
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
