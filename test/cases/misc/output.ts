/* eslint-disable */
/* autogenerated by openapi-superstruct */

import * as s from 'superstruct';

const struct_Has_spaces_in_name = s.object({
  "field with spaces": s.string(),
  "just has default": s.literal("SOME VALUE"),
});
const struct_AdditionalProperties = s.record(s.string(), s.integer());
const struct_HasOptionalAdditionalProperties = s.object({
  "optional_additionalProperties": s.optional(s.record(s.string(), s.boolean())),
  "optional_nullable_additionalProperties": s.optional(s.nullable(s.record(s.string(), s.string()))),
});
const struct_OneOf = s.union([s.string(), s.integer()]);

export const structs = {
  "Has_spaces_in_name": struct_Has_spaces_in_name,
  "AdditionalProperties": struct_AdditionalProperties,
  "HasOptionalAdditionalProperties": struct_HasOptionalAdditionalProperties,
  "OneOf": struct_OneOf,
};

export type Has_spaces_in_name = s.Infer<typeof structs['Has_spaces_in_name']>;
export type AdditionalProperties = s.Infer<typeof structs['AdditionalProperties']>;
export type HasOptionalAdditionalProperties = s.Infer<typeof structs['HasOptionalAdditionalProperties']>;
export type OneOf = s.Infer<typeof structs['OneOf']>;
