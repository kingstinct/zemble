/* eslint-disable @typescript-eslint/no-explicit-any */
export type GreaterThan<
  A extends number,
  B extends number,
  S extends readonly any[] = readonly []
> = S['length'] extends A
  ? false
  : S['length'] extends B
    ? true
    : GreaterThan<A, B, readonly [...S, any]>;

export type LessThan<
  A extends number,
  B extends number,
  S extends readonly any[] = readonly []
> = S['length'] extends B
  ? false
  : S['length'] extends A
    ? true
    : LessThan<A, B, readonly [...S, any]>;

export type Subtract<
  A extends number,
  B extends number,
  I extends readonly any[] = readonly [],
  O extends readonly any[] = readonly []
> = LessThan<A, B> extends true
  ? never
  : LessThan<I['length'], A> extends true
    ? Subtract<
      A,
      B,
      readonly [...I, any],
      LessThan<I['length'], B> extends true ? O : readonly [...O, any]
    >
    : O['length'];
    type ArrayElement<ArrayType extends readonly any[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type ToSerializedObject<T extends object, MaxDepth extends number> =
{ readonly
  [P in keyof T]: Serialized<T[P], MaxDepth>;
}

type ToSerializedArray<TArr extends readonly any[], MaxDepth extends number> = ReadonlyArray<Serialized<ArrayElement<TArr>, MaxDepth>>;

export type Serialized<T = any, MaxDepth extends number = 10> =
  T extends string ? string
    : T extends number ? number
      : T extends boolean ? boolean
        : T extends ReadonlyArray<any> ? (GreaterThan<MaxDepth, 0> extends true
          ? ToSerializedArray<T, Subtract<MaxDepth, 1>>
          : never)
          : T extends Record<string | number | symbol, any> ? (GreaterThan<MaxDepth, 0> extends true
            ? ToSerializedObject<T, Subtract<MaxDepth, 1>>
            : never)
            : string;
