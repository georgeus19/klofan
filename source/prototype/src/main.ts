import fs from 'fs/promises';

const args = process.argv.slice(2);

async function main() {
    console.log('args:', args);
    const data = await fs.readFile(args[0]);
}

main();
