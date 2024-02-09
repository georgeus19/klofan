import { Request } from 'express';
import formidable from 'formidable';

export function parseMultipartRequest(request: Request) {
    return new Promise((resolve, reject) => {
        const form = formidable({ keepExtensions: true });

        form.parse(request, (error, fields, files) => {
            if (error) {
                reject(error);
            }
            resolve({ ...fields, ...files });
        });
    });
}
