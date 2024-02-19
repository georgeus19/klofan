import winston from 'winston';
import 'winston-mongodb';
import { SERVER_ENV } from '../env/server';

export const createLogger = () => {
    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.metadata()),
        transports: [
            new winston.transports.MongoDB({
                db: `${SERVER_ENV.MONGO_URL}/logs`,
                options: {
                    useUnifiedTopology: true,
                },
                collection: 'info',
                level: 'info',
                leaveConnectionOpen: false,
                expireAfterSeconds: 2592000,
            }),
            new winston.transports.MongoDB({
                db: `${SERVER_ENV.MONGO_URL}/logs`,
                options: {
                    useUnifiedTopology: true,
                },
                collection: 'warnings',
                level: 'warn',
                leaveConnectionOpen: false,
                expireAfterSeconds: 2592000,
            }),
        ],
        exceptionHandlers: [
            new winston.transports.MongoDB({
                db: `${SERVER_ENV.MONGO_URL}/logs`,
                options: {
                    useUnifiedTopology: true,
                },
                collection: 'uncaught-exceptions',
                leaveConnectionOpen: false,
            }),
        ],
        rejectionHandlers: [
            new winston.transports.MongoDB({
                db: `${SERVER_ENV.MONGO_URL}/logs`,
                options: {
                    useUnifiedTopology: true,
                },
                collection: 'uncaught-rejections',
                leaveConnectionOpen: false,
            }),
        ],
    });

    //
    // If we're not in production then log to the `console` with the format:
    // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
    //
    if (SERVER_ENV.NODE_ENV !== 'production') {
        logger.add(
            new winston.transports.Console({
                format: winston.format.simple(),
            })
        );
    }
    return logger;
};
