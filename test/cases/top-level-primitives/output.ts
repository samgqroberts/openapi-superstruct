/* eslint-disable */
/* autogenerated by openapi-superstruct */

import * as s from 'superstruct';

const struct_String = s.string();
const struct_Nullable_string_date = s.nullable(s.string());
const struct_String_date-time = s.string();
const struct_Nullable_string_password = s.nullable(s.string());
const struct_String_byte = s.string();
const struct_Nullable_string_binary = s.nullable(s.string());
const struct_Number = s.number();
const struct_Nullable_number_float = s.nullable(s.number());
const struct_Number_double = s.number();
const struct_Nullable_integer = s.nullable(s.integer());
const struct_Integer_int32 = s.integer();
const struct_Nullable_integer_int64 = s.nullable(s.integer());
const struct_Boolean = s.boolean();

export const structs = {
  String: struct_String,
  Nullable_string_date: struct_Nullable_string_date,
  String_date-time: struct_String_date-time,
  Nullable_string_password: struct_Nullable_string_password,
  String_byte: struct_String_byte,
  Nullable_string_binary: struct_Nullable_string_binary,
  Number: struct_Number,
  Nullable_number_float: struct_Nullable_number_float,
  Number_double: struct_Number_double,
  Nullable_integer: struct_Nullable_integer,
  Integer_int32: struct_Integer_int32,
  Nullable_integer_int64: struct_Nullable_integer_int64,
  Boolean: struct_Boolean,
};

export type String = s.Infer<typeof structs['String']>;
export type Nullable_string_date = s.Infer<typeof structs['Nullable_string_date']>;
export type String_date-time = s.Infer<typeof structs['String_date-time']>;
export type Nullable_string_password = s.Infer<typeof structs['Nullable_string_password']>;
export type String_byte = s.Infer<typeof structs['String_byte']>;
export type Nullable_string_binary = s.Infer<typeof structs['Nullable_string_binary']>;
export type Number = s.Infer<typeof structs['Number']>;
export type Nullable_number_float = s.Infer<typeof structs['Nullable_number_float']>;
export type Number_double = s.Infer<typeof structs['Number_double']>;
export type Nullable_integer = s.Infer<typeof structs['Nullable_integer']>;
export type Integer_int32 = s.Infer<typeof structs['Integer_int32']>;
export type Nullable_integer_int64 = s.Infer<typeof structs['Nullable_integer_int64']>;
export type Boolean = s.Infer<typeof structs['Boolean']>;
