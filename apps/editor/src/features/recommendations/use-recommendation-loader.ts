import { IdentifiableRecommendation } from '@klofan/recommender/recommendation';
import { Schema } from '@klofan/schema';
import { Instances } from '@klofan/instances';
import { v4 as uuidv4 } from 'uuid';

let ws = new WebSocket(import.meta.env.VITE_RECOMMENDER_MANAGER_URL);
console.log('RM URL', import.meta.env.VITE_RECOMMENDER_MANAGER_URL);
let closingWebSockets: WebSocket[] = [];
let request = {
    id: uuidv4(),
    partiallyLoaded: false,
};

export function useRecommendationLoader({
    schema,
    instances,
}: {
    schema: Schema;
    instances: Instances;
}) {
    const getRecommendations = (
        addRecommedations: (x: {
            recommendations: IdentifiableRecommendation[];
            partiallyLoaded: boolean;
        }) => void
    ): void => {
        request = {
            id: uuidv4(),
            partiallyLoaded: false,
        };
        const requestId = request.id;
        ws.onmessage = (event) => {
            const fetchedRecommendations: IdentifiableRecommendation[] = JSON.parse(event.data);
            // If recommendations are from previous request, discard them.
            if (request.id !== requestId) {
                return;
            }
            if (fetchedRecommendations.length > 0) {
                addRecommedations({
                    recommendations: fetchedRecommendations,
                    partiallyLoaded: true,
                });

                request = { ...request, partiallyLoaded: true };
            } else {
                addRecommedations({ recommendations: [], partiallyLoaded: true });
            }
        };
        if (ws.readyState === WebSocket.CLOSING || ws.readyState === WebSocket.CLOSED) {
            closingWebSockets = [
                ...closingWebSockets.filter(
                    (closingWebSocket) => closingWebSocket.readyState === WebSocket.CLOSING
                ),
                ws,
            ];
            ws = new WebSocket(import.meta.env.VITE_RECOMMENDER_MANAGER_URL);
        }
        if (ws.readyState === WebSocket.OPEN) {
            sendSchemaAndInstances({ schema, instances });
        } else {
            ws.onopen = (event) => {
                sendSchemaAndInstances({ schema, instances });
            };
        }
    };
    return { getRecommendations };
}

function sendSchemaAndInstances({ schema, instances }: { schema: Schema; instances: Instances }) {
    ws.send(
        JSON.stringify({
            schema: schema.raw(),
            instances: instances.raw(),
        })
    );
}
