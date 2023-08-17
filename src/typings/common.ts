export type Maybe<T> = T | null;
export type MaybeUndef<T> = T | undefined;
export type NullableUndef<T> = T | undefined | null;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type AdditionalActionType = {
  additionalAction?: () => void
};

type AdditionalActionOnDecryptErrorType = {
  additionalActionOnDecryptError?: () => void
};

export type AddActionType<InputType> = InputType & AdditionalActionType;

export type AddActionOnDecryptErrorType<InputType> = InputType & AdditionalActionOnDecryptErrorType;
