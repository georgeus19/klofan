import winston from 'winston';
import 'winston-mongodb';

export const createLogger = () => {
    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.metadata()
        ),
        transports: [
            new winston.transports.Console({
                format: winston.format.simple(),
            }),
        ],
    });

    return logger;
};
