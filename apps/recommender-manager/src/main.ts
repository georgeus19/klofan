import { SERVER_ENV } from '@klofan/config/env/server';
import { createLogger } from '@klofan/config/logger';
import { WebSocket, WebSocketServer } from 'ws';
import { parseInput } from '@klofan/server-utils';
import axios from 'axios';
import { z } from 'zod';
import { IdentifiableRecommendation } from '@klofan/recommender/recommendation';

const wss = new WebSocketServer({ port: SERVER_ENV.RECOMMENDER_MANAGER_PORT });
export const logger = createLogger();
logger.info(`Recommender Manager started on port ${SERVER_ENV.RECOMMENDER_MANAGER_PORT}`);
const requestSchema = z.object({
    schema: z.object({}).passthrough(),
    instances: z.object({}).passthrough(),
});

wss.on('connection', (ws: WebSocket) => {
    ws.on('message', async (message) => {
        try {
            const body = await parseInput(requestSchema, JSON.parse(message.toString()));
            console.log('active recommenders', SERVER_ENV.recommenderUrls);
            await Promise.allSettled(
                SERVER_ENV.recommenderUrls.map((url) =>
                    axios.post(`${url}/api/v1/recommend`, body).then((response) => {
                        const recommendations = response.data as Array<IdentifiableRecommendation>;
                        logger.debug(
                            `Recommender ${url} gave ${recommendations.length} recommendations`
                        );
                        if (recommendations.length > 0) {
                            ws.send(JSON.stringify(response.data));
                        }
                    })
                )
            );
            await new Promise((f) => setTimeout(f, 2000));
            ws.send(JSON.stringify([]));
        } catch (error) {
            logger.error(
                (error as any).message ??
                    'Error without message from Recommender Manager websocket message event',
                error
            );
            ws.send(JSON.stringify([]));
        }
    });
});
