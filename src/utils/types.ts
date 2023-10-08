// typescript utility function that makes all properties of an object optional except for those specified
export type PartialExcept<T, K extends keyof T> = Prettify< Partial<T> & Pick<T, K>>;

// typescript utility that unwraps and "prettifies" a type so all of the attibutes are visible listed on hover
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & NonNullable<unknown>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnwrapTRPCMutationUgly<TMutation> = TMutation extends () => Record<"mutate", any>
  ? Parameters<ReturnType<TMutation>["mutate"]>[0]
  : never;

export type UnwrapTRPCMutation<T> =  Prettify<UnwrapTRPCMutationUgly<T>>;