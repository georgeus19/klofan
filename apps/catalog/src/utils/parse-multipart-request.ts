import { Request } from 'express';
import formidable from 'formidable';

export function parseMultipartRequest(request: Request) {
    return new Promise((resolve, reject) => {
        const form = formidable({});

        form.parse(request, (error, fields, files) => {
            if (error) {
                reject(error);
            }
            console.log('fields', fields);
            console.log('files', files);
            resolve({ ...fields, ...files });
        });
    });
}
