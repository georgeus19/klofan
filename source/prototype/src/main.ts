import fs from 'fs/promises';
import { parseSchema } from './schema-parser';

const args = process.argv.slice(2);

async function main() {
    console.log('args:', args);
    require('util').inspect.defaultOptions.depth = null;
    const data = await fs.readFile(args[0]);
    const obj = JSON.parse(data.toString())[0];
    const [schema, entities, literals, instances, schemaInstanceMap]: any = parseSchema(obj);
    // console.log(JSON.stringify(schema));
    // console.log('entities:', entities);
    console.log(schema);
}

main();
