/* eslint-disable */
/* autogenerated by openapi-superstruct */

import * as s from 'superstruct';

const struct_Has_spaces_in_name = s.object({
  "field with spaces": s.string(),
  "just has default": s.literal("SOME VALUE"),
});

export const structs = {
  "Has_spaces_in_name": struct_Has_spaces_in_name,
};

export type Has_spaces_in_name = s.Infer<typeof structs['Has_spaces_in_name']>;