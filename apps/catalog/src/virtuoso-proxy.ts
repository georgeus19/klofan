import { Request } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { SERVER_ENV } from '@klofan/config/env/server';
import { GRAPH_STORE_PATH, logger, VIRTUOSO_GRAPH_STORE_PATH } from './main';
import { OnProxyResCallback } from 'http-proxy-middleware/dist/types';

/**
 * Proxy of sparql graph store api to Virtuoso.
 */
export const virtuosoProxy = (onProxyResponse: OnProxyResCallback) =>
    createProxyMiddleware({
        target: SERVER_ENV.VIRTUOSO_URL,
        changeOrigin: true,
        pathRewrite: rewriteFn,
        onProxyRes: onProxyResponse,
    });

function rewriteFn(path: string, req: Request) {
    const newPath: string = path
        .replace(/default=?.*/, `graph=${req.query.graph as string}`)
        .replace(GRAPH_STORE_PATH, VIRTUOSO_GRAPH_STORE_PATH);
    logger.info(`Old path: ${path}, New path: ${newPath}`);
    return newPath;
}
