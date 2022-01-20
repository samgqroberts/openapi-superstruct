#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

'use strict';

const path = require('path');
const program = require('commander');
const pkg = require('../package.json');

program
  .name('openapi-superstruct')
  .usage('[options]')
  .version(pkg.version)
  .argument('<input>', 'OpenAPI specification file (required)')
  .option('-o <value>', 'Output file name')
  .parse(process.argv);

const args = program.args;
const opts = program.opts();

const OpenAPISuperstruct = require(path.resolve(__dirname, '../dist/index.js'));

if (OpenAPISuperstruct) {
  OpenAPISuperstruct.generate({
    input: args[0],
    output: opts.o
  })
    .then((output) => {
      console.log(output);
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
