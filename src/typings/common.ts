export type Maybe<T> = T | null;
export type MaybeUndef<T> = T | undefined;
export type NullableUndef<T> = T | undefined | null;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type AdditionalActionOnSuccessType = {
  additionalActionOnSuccess?: () => void
};

type AdditionalActionOnErrorType = {
  additionalActionOnSuccess?: () => void
};

type AdditionalActionOnDecryptErrorType = {
  additionalActionOnDecryptError?: () => void
};

export type AddActionOnSuccessType<InputType> = InputType & AdditionalActionOnSuccessType;

export type AddActionOnErrorType<InputType> = InputType & AdditionalActionOnErrorType;

export type AddActionOnSuccessAndErrorType<InputType> =
    InputType & AdditionalActionOnSuccessType & AdditionalActionOnErrorType;

export type AddActionOnDecryptErrorType<InputType> = InputType & AdditionalActionOnDecryptErrorType;
