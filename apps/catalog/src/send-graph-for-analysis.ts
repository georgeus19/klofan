import { OnProxyResCallback } from 'http-proxy-middleware/dist/types';
import { Request, Response } from 'express';
import axios, { AxiosError } from 'axios';
import { SERVER_ENV } from '@klofan/config/env/server';
import FormData from 'form-data';
import type http from 'http';
import { logger, VIRTUOSO_GRAPH_STORE_PATH } from './main';
import { logAxiosError } from '@klofan/server-utils';
import { AnalysisDoneProvoNotification } from '@klofan/analyzer/communication';

/**
 * Function for sending uploaded graph to analyzer manager. It must be called in proxy response event.
 * It asynchronously sends the graph for analysis but does not modify original response in any way even if it fails.
 */
export const sendGraphForAnalysis: OnProxyResCallback = async (
    proxyRes: http.IncomingMessage,
    request: Request,
    response: Response
) => {
    try {
        await onProxyResponse(proxyRes, request, response);
    } catch (error) {
        if (error instanceof AxiosError) {
            logAxiosError(logger, error, `Unhandled error from sendGraphForAnalysis in catalog`);
        } else {
            logger.error(`Unhandled error from sendGraphForAnalysis in catalog`, error);
        }
    }
};
async function onProxyResponse(
    proxyRes: http.IncomingMessage,
    request: Request,
    response: Response
): Promise<void> {
    if (!(request.method === 'POST' || request.method === 'PUT')) {
        return;
    }

    // Either graph uri is provided as graph in query which is validated by zod schema below
    // or graph uri is generated and added to `request.query.graph` as string.
    const graphUri = request.query.graph as string;

    response.setHeader('Graph-Uri', graphUri);

    const graphResponse = await axios
        .get(`${SERVER_ENV.VIRTUOSO_URL}${VIRTUOSO_GRAPH_STORE_PATH}?graph=${graphUri}`, {
            headers: {
                Accept: 'application/ld+json',
            },
            responseType: 'stream',
        })
        .then(({ data }) => ({ graph: data }))
        .catch((error) => {
            logAxiosError(logger, error, `Cannot get graph ${graphUri} from Virtuoso.`, {
                includeData: false,
            });
            return { graph: null };
        });
    if (!graphResponse.graph) {
        return;
    }
    const formData = new FormData();
    formData.append('files', graphResponse.graph, { filename: 'graph.jsonld' });

    const provenanceNotification: AnalysisDoneProvoNotification = {
        type: 'analysis-done-provo-notification',
        url: `${SERVER_ENV.CATALOG_URL}/rdf-graph-store?default`,
    };
    formData.append('notifications', JSON.stringify([provenanceNotification]));
    const headers = formData.getHeaders();

    await axios
        .post(`${SERVER_ENV.ANALYZER_MANAGER_URL}/api/v1/dataset/dcat`, formData, {
            headers: {
                ...headers,
            },
        })
        .then(({ data }) => {
            logger.info(`Submitted ${graphUri} to analyzer manager for analysis.`, data);
        })
        .catch((error) => {
            logAxiosError(logger, error, `Error when submitting ${graphUri} to analyzer manager`);
        });
}
