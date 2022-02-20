import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { fileSync } from 'tmp';

describe('bin', () => {
  let sampleInputPath: string;
  let sampleOutput: string;
  beforeEach(() => {
    sampleInputPath = 'test/cases/simple/input.json';
    const sampleOutputPath = 'test/cases/simple/output.ts';
    sampleOutput = readFileSync(sampleOutputPath).toString();
  });
  it('displays help with --help', () => {
    expect(execSync('bin/index.js --help').toString()).toEqual(
      `Usage: openapi-superstruct [options]

Arguments:
  input          OpenAPI specification file (required)

Options:
  -V, --version  output the version number
  -o <value>     Output file name
  -h, --help     display help for command
`
    );
  });
  it('rejects invocation with no positional argument', () => {
    expect(() => execSync('bin/index.js')).toThrow(`Command failed: bin/index.js
error: missing required argument 'input'
`);
  });
  it('prints to stdout when no output file specified', () => {
    expect(execSync(`bin/index.js ${sampleInputPath}`).toString()).toEqual(
      `${sampleOutput}\n`
    );
  });
  it('simply prints success message when output file specified', () => {
    const { name: path } = fileSync();
    expect(
      execSync(
        `bin/index.js test/cases/simple/input.json -o ${path}`
      ).toString()
    ).toEqual(`Successfully wrote to file ${path}\n`);
    expect(readFileSync(path).toString()).toEqual(sampleOutput);
  });
});
