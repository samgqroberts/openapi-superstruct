import { writeFileSync } from 'fs';
import $RefParser from 'json-schema-ref-parser';
import { fileSync } from 'tmp';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function parseInputOrThrow(input: string | object): Promise<any> {
  if (typeof input === 'object') {
    return parseInputObjectOrThrow(input);
  }
  return parseInputFileOrThrow(input);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function parseInputObjectOrThrow(obj: object): Promise<any> {
  const { fd, name: path } = fileSync();
  writeFileSync(fd, JSON.stringify(obj));
  return parseInputFileOrThrow(path);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseInputFileOrThrow = async (
  location: string
): Promise<$RefParser.JSONSchema> => {
  try {
    const schema = await $RefParser.bundle(location, location, {});
    return schema;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
};
