import z from 'zod';
export type AnalysisNotification = AnalysisDoneProvoNotification;

export type AnalysisDoneProvoNotification = {
    type: 'analysis-done-provo-notification';
    url: string;
};

export function analysisDoneProvoNotificationSchema() {
    return z.object({
        type: z.enum(['analysis-done-provo-notification']),
        url: z.string().url(),
    });
}
