import fs from 'fs';
import path from 'path';
import assert from 'assert';
import obj2cssvar from '../obj2cssvar.mjs';

const snapshotsDir = path.resolve('snapshots');
const inputsDir = path.join(snapshotsDir, 'inputs');
const outputsDir = path.join(snapshotsDir, 'outputs');

for (const inputFileName of fs.readdirSync(inputsDir)) {
    const inputFilePath = path.join(inputsDir, inputFileName);
    const outputFilePath = path.join(outputsDir, inputFileName + '.css');
    const input = fs.readFileSync(inputFilePath, 'utf-8');
    const actual = obj2cssvar(JSON.parse(input));

    if (process.env.UPDATE_SNAPSHOT) {
        fs.writeFileSync(outputFilePath, actual, 'utf-8');
    } else {
        const expected = fs.readFileSync(outputFilePath, 'utf-8');
        assert.strictEqual(actual, expected, inputFileName);
    }
}
