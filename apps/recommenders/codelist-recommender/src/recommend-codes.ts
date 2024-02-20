import * as _ from 'lodash';
import { Schema } from '@klofan/schema';
import { Instances } from '@klofan/instances';
import { Recommendation } from '@klofan/recommender/recommendation';
import axios from 'axios';
import { SERVER_ENV } from '@klofan/config/env/server';
import { CodeListAnalysis, getCodeListAnalysisType } from '@klofan/analyzer/analysis';

export async function recommendCodes({ schema, instances }: { schema: Schema; instances: Instances }): Promise<Recommendation[]> {
    const { data } = await axios.get(`${SERVER_ENV.ADAPTER_URL}/api/v1/analyses?types=${getCodeListAnalysisType()}`);
    const analyses: CodeListAnalysis[] = data;
    console.log(analyses);
    return [];
}
