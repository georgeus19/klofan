import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { DcatDataset } from '../dataset/dcat';
import { AnalysisWithoutId } from '../analysis/analysis';
import { analyzeDcat } from './controllers/analyze-dcat';
import { analyzeDcatFiles } from './controllers/analyze-dcat-files';

export type AnalyzerServerOptions = {
    port: number;
};

export function runAnalyzerServer(analyze: (dataset: DcatDataset) => Promise<AnalysisWithoutId[]>, { port }: AnalyzerServerOptions) {
    const app: Express = express();
    app.use(cors());
    app.use(bodyParser.json());

    app.post('/api/v1/dataset/dcat', analyzeDcat(analyze));
    app.post('/api/v1/file/dataset/dcat', analyzeDcatFiles(analyze));

    app.listen(port, () => {
        console.log(`Analyzer started on port ${port}`);
    });
}
