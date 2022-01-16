#!/usr/bin/env node

'use strict';

const path = require('path');
const program = require('commander');
const pkg = require('../package.json');

program
  .name('openapi-superstruct')
  .usage('[options]')
  .version(pkg.version)
  .argument('<input>', 'OpenAPI specification file (required)')
  .parse(process.argv);

const OpenAPISuperstruct = require(path.resolve(__dirname, '../dist/index.js'));

if (OpenAPISuperstruct) {
  OpenAPISuperstruct.generate({
    input: program.args[0],
  })
    .then((output) => {
      console.log(output)
      process.exit(0);
    })
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}