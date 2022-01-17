import { readFileSync } from 'fs';
import OpenAPISchemaValidator from 'openapi-schema-validator';

describe('sample-specs', () => {
  let validate: (path: string) => unknown[];
  beforeEach(() => {
    const validator = new OpenAPISchemaValidator({
      version: 3
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  describe('one-model-complex-types.json', () =>
    it('is a valid openapi spec', () =>
      expect(
        validate('./src/sample-specs/one-model-complex-types.json')
      ).toEqual([])));
  describe('multiple-models-top-level-primitives.json', () =>
    it('is a valid openapi spec', () =>
      expect(
        validate('./src/sample-specs/multiple-models-top-level-primitives.json')
      ).toEqual([])));
  describe('multiple-models-misc-cases.json', () =>
    it('is a valid openapi spec', () =>
      expect(
        validate('./src/sample-specs/multiple-models-misc-cases.json')
      ).toEqual([])));
  describe('references.json', () =>
    it('is a valid openapi spec', () =>
      expect(validate('./src/sample-specs/references.json')).toEqual([])));
});
