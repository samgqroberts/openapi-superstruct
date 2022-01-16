import { readFileSync } from 'fs';
import OpenAPISchemaValidator from 'openapi-schema-validator';

describe('sample-specs', () => {
  let validate: (path: string) => unknown[];
  beforeEach(() => {
    const validator = new OpenAPISchemaValidator({
      version: 3
    });
    const readFile = (path: string): any => {
      return JSON.parse(readFileSync(path).toString());
    };
    validate = (path) => validator.validate(readFile(path)).errors;
  });
  describe('simple.json', () =>
    it('is a valid openapi spec', () =>
      expect(validate('./src/sample-specs/simple.json')).toEqual([])));
  describe('one-model-all-primitives.json', () =>
    it('is a valid openapi spec', () =>
      expect(
        validate('./src/sample-specs/one-model-all-primitives.json')
      ).toEqual([])));
});
