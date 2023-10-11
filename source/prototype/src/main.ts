import fs from 'fs';
import { parseJson } from './parse/parse';
import { State } from './state/state';
import { InMemoryModel } from './state/in-memory-model';
import { createDefaultOutputConfiguration } from './export/default-output-configuration';
import { exportSchema } from './export/export-schema';
import { Writer } from 'n3';
import { exportInstances } from './export/export-instances';
import { MoveProperty } from './commands/move-property';
import { AllToOneInstanceMapping } from './instance-mapping';
import { AllToOneLiteralMapping } from './literal-mapping';
require('util').inspect.defaultOptions.depth = null;

async function main() {
    const args = process.argv.slice(2);
    console.log('args:', args);
    const inputFile = args[0];
    const outputDir = args[1];
    const data = (await fs.promises.readFile(inputFile)).toString();
    const state: State = parseJson(data);
    const model = new InMemoryModel(state);

    // new MoveProperty({
    //     source: '1',
    //     target: '2',
    //     property: 'p32-countries',
    //     instanceMapping: new AllToOneInstanceMapping(0, [0]),
    //     literalMapping: new AllToOneLiteralMapping(0, model.propertyInstances('1', 'p32-countries')[0].literals!),
    // });

    const outputConfiguration = createDefaultOutputConfiguration(model);
    const instanceOutputWriter = new Writer(fs.createWriteStream(`${outputDir}/instances.ttl`));
    exportInstances(model, outputConfiguration, instanceOutputWriter);
    const schemaOutputWriter = new Writer(fs.createWriteStream(`${outputDir}/schema.ttl`));
    exportSchema(model, outputConfiguration, schemaOutputWriter);
}

main();
