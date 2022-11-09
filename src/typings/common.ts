export type Maybe<T> = T | null;
export type MaybeUndef<T> = T | undefined;
export type NullableUndef<T> = T | undefined | null;

type AdditionalActionType = {
  additionalAction?: () => void
};

export type AddActionType<InputType> = InputType & AdditionalActionType;
