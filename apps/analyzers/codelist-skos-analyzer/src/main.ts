import express, { Express } from 'express';
import { analyzeDcatDataset } from './controllers/analyze-dcat-dataset';
import bodyParser from 'body-parser';
import cors from 'cors';

const port = 10001;
const app: Express = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/v1/dataset/dcat', analyzeDcatDataset);

app.listen(port, () => {
    console.log(`Analyzer Manager started on port ${port}`);
});
