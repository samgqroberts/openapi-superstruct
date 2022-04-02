import { mkdirSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';

import { parseInputOrThrow } from './parseInput';

export interface GenerateParams {
  input: string | object;
  output?: string;
}

function variableName(name: string): string {
  return name.replace(/\s/g, '_').replace(/-/g, '_');
}

export async function generate({
  input,
  output
}: GenerateParams): Promise<string> {
  const spec = await parseInputOrThrow(input);
  const schemas = spec?.components?.schemas || {};
  const components = Object.entries(schemas)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map(([modelName, schema]: [string, any]) => {
      const varName = variableName(modelName);
      const declaration = `const struct_${varName} = ${deriveSType(
        1,
        modelName,
        null,
        schema,
        []
      )};`;
      const struct = `  "${varName}": struct_${varName},`;
      const type = `export type ${varName} = s.Infer<typeof structs['${varName}']>;`;
      return [declaration, struct, type];
    });
  const declarations = components.map((c) => c[0]).join('\n');
  const structs = components.map((c) => c[1]).join('\n');
  const types = components.map((c) => c[2]).join('\n');
  const paths = `${getPaths(spec)}`
  const file = `/* eslint-disable */
/* autogenerated by openapi-superstruct */

import * as s from 'superstruct';

${declarations}

export const structs = {
${structs}
};

${types}
${paths}`;
  if (output) {
    const absolute = resolve(output);
    mkdirSync(dirname(absolute), { recursive: true });
    writeFileSync(absolute, file);
    return absolute;
  }
  return file;
}

function getPaths(spec: any): string {
  const paths = spec.paths ? Object.entries(spec.paths) : []
  const pathStrings = paths.flatMap(([path, pathObj]) => {
    if (!isRecord(pathObj)) return [];
    const endpoints = (['get', 'post', 'delete', 'put', 'patch']).map(method => {
      const endpointObj = pathObj[method]
      if (!isRecord(endpointObj)) return undefined;
      const endpointName = typeof endpointObj.operationId === 'string'
        ? endpointNameFromOperationId(endpointObj.operationId)
        : endpointNameFromPath(path)
      const parameters: string[] = [];
      if (isArray(endpointObj.parameters)) {
        endpointObj.parameters.forEach(param => {
          if (isRecord(param)) {
            const paramName = param.name;
            let paramType = 'string';
            if (isRecord(param.schema)) {
              if (param.schema.type === 'integer') {
                paramType = 'number';
              }
            }
            parameters.push(`${paramName}: ${paramType}`)
          }
        })
      }
      let bodyVariableName: string | undefined = undefined;
      let funcReturnTypeGeneric = 'unknown'
      if (isRecord(endpointObj.requestBody)) {
        const { content } = endpointObj.requestBody;
        if (isRecord(content)) {
          const applicationJson = content['application/json'];
          if (isRecord(applicationJson)) {
            const schema = applicationJson.schema;
            if (isRecord(schema)) {
              if (typeof schema.$ref === 'string') {
                const refComponents = schema.$ref.split('/')
                const modelName = refComponents[refComponents.length - 1]
                const variableName = modelName[0].toLocaleLowerCase() + modelName.slice(1)
                parameters.push(`${variableName}: ${modelName}`)
                funcReturnTypeGeneric = modelName
                bodyVariableName = variableName
              }
            }
          }
        }
      }
      const funcReturnType = method === 'get'
        ? 'PreparedGet'
        : method === 'post'
          ? `PreparedPost<${funcReturnTypeGeneric}>`
          : method === 'put'
            ? `PreparedPut<${funcReturnTypeGeneric}>`
            : method === 'patch'
              ? `PreparedPatch<${funcReturnTypeGeneric}>`
              : method === 'delete'
                ? 'PreparedDelete'
                : 'unknown'
      const bodyLine = bodyVariableName ? `\n  const body = ${bodyVariableName};` : '';
      const returnMembers = ['method', 'url'];
      if (bodyLine !== '') {
        returnMembers.push('body');
      }
      return `const path_${endpointName} = (${parameters.join(', ')}): ${funcReturnType} => {
  const method = '${method}';
  const url = '${path}';${bodyLine}
  return { ${returnMembers.join(', ')} };
}`
    }).filter(isDefined)
    return endpoints;
  })
  if (pathStrings.length === 0) return '';
  return `
interface PreparedGet {
  method: 'get';
  url: string;
}
interface PreparedPut<Body> {
  method: 'put';
  url: string;
  body: Body;
}
interface PreparedPost<Body> {
  method: 'post';
  url: string;
  body: Body;
}
interface PreparedDelete {
  method: 'delete';
  url: string;
}
interface PreparedPatch<Body> {
  method: 'patch';
  url: string;
  body: Body;
}

${pathStrings.join('\n')}
`
}

function isArray(x: unknown): x is unknown[] {
  return Array.isArray(x)
}

function endpointNameFromOperationId(operationId: string): string {
  return operationId
}

function endpointNameFromPath(path: string): string {
  return 'todo'
}

function isDefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return !!x && typeof x === 'object'
}

// TODO samgqroberts 2022-02-20 look at description field and generate comments
function deriveSType(
  indentation: number,
  modelName: string,
  propertyName: string | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type: any,
  required: string[]
): string {
  if (!type) {
    return 's.unknown()';
  }
  const base = type.type;
  const isNullable = !!type.nullable;
  const isOptional = propertyName !== null && !required.includes(propertyName);
  const baseSType = (() => {
    if (base === 'string') return 's.string()';
    if (base === 'number') return 's.number()';
    if (base === 'integer') return 's.integer()';
    if (base === 'boolean') return 's.boolean()';
    if (base === 'array') {
      const items = type.items;
      const nestedSType = deriveSType(indentation, modelName, null, items, []);
      return `s.array(${nestedSType})`;
    }
    if (base === 'object') {
      if (type.additionalProperties) {
        const nestedType = deriveSType(
          indentation + 1,
          modelName,
          null,
          type.additionalProperties,
          []
        );
        return `s.record(s.string(), ${nestedType})`;
      }
      if (type.properties) {
        const indentationStr = Array(indentation).join('  ');
        const nestedIndentationStr = indentationStr + '  ';
        const propertiesStr = Object.entries(type.properties || {})
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map(([nestedPropertyName, nestedType]: [string, any]) => {
            const sType = deriveSType(
              indentation + 1,
              modelName,
              nestedPropertyName,
              nestedType,
              type.required || []
            );
            return `${nestedIndentationStr}"${nestedPropertyName}": ${sType},`;
          })
          .join('\n');
        return `s.object({\n${propertiesStr}\n${indentationStr}})`;
      }
      return `s.record(s.string(), s.unknown())`;
    }
    if (typeof type.default === 'string') {
      return `s.literal("${type.default}")`;
    }
    if (typeof type.$ref === 'string') {
      const ref = type.$ref as string;
      if (ref.startsWith('#/components/schemas/')) {
        const refName = ref.substring('#/components/schemas/'.length);
        const structName = `struct_${variableName(refName)}`;
        return `s.lazy(() => ${structName})`;
      }
    }
    if (Array.isArray(type.oneOf)) {
      const elementSTypes = type.oneOf.map((type: unknown) =>
        deriveSType(indentation, modelName, null, type, [])
      );
      return `s.union([${elementSTypes.join(', ')}])`;
    }
    return 's.unknown()';
  })();
  const consideringNullable = isNullable
    ? `s.nullable(${baseSType})`
    : baseSType;
  const consideringOptional = isOptional
    ? `s.optional(${consideringNullable})`
    : consideringNullable;
  return consideringOptional;
}
