# openapi-superstruct

In development.

## Goals

Given an OpenAPI spec, generate a .ts file with superstruct definitions of each model.

- .ts file should export `Infer`ed types for each of these models as well.
- can invoke like `npx openapi-superstruct <openapi-file>`
- <openapi-file> can be a local file or an http / https url
- works for both JSON and YAML openapi file types
