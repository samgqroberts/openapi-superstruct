import './cases/all-primitives/output';
import './cases/complex-types/output';
import './cases/misc/output';
import './cases/paths/output';
import './cases/references/output';
import './cases/simple/output';
import './cases/top-level-primitives/output';

import { readFileSync } from 'fs';
import OpenAPISchemaValidator from 'openapi-schema-validator';

import { generate } from '../src';

const cases = [
  'all-primitives',
  'complex-types',
  'misc',
  'paths',
  'references',
  'simple',
  'top-level-primitives'
];

describe('cases', () => {
  cases.forEach((caseName) => {
    describe(caseName, () => {
      const inputPath = `./test/cases/${caseName}/input.json`;
      const outputPath = `./test/cases/${caseName}/output.ts`;
      it('input is valid OpenAPI spec', () => {
        const validator = new OpenAPISchemaValidator({
          version: 3
        });
        const specObject = JSON.parse(readFileSync(inputPath).toString());
        expect(validator.validate(specObject).errors).toEqual([]);
      });
      it('output matches expectations', async () => {
        const output = await generate({
          input: inputPath
        });
        const expectedOutput = readFileSync(outputPath).toString();
        expect(output).toEqual(expectedOutput);
      });
    });
  });
});
