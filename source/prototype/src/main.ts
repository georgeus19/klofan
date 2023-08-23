import fs from 'fs/promises';
import { parseSchemaFromJson } from './schema-parser';

const args = process.argv.slice(2);

async function main() {
    console.log('args:', args);
    const data = await fs.readFile(args[0]);
    const schema = parseSchemaFromJson(data.toString());
    console.log(JSON.stringify(schema));
}

main();
