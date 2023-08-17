export enum TxKindByName {
  'generic' = 16,
  'register' = 17,
  'deploy' = 18,
  'patch' = 19,
  'block' = 20,
  'lstore' = 22,
  'notify' = 23,
  'chkey' = 24,
}

// TODO export from lib
export enum TxTag {
  PUBLIC_KEY = 0x02,
  SIGNATURE = 0xFF,
}

export enum TxPurpose {
  TRANSFER = 0x00,
  SRCFEE = 0x01,
  GAS = 0x03,
}

export enum TxKind {
  GENERIC = 0x10,
  REGISTER = 0x11,
  DEPLOY = 0x12,
  PATCH = 0x13,
  LSTORE = 22,
}

export interface TxBody {
  k: number;
  t: TxKind;
  f: Buffer;
  to: Buffer;
  s: number;
  p: Array<[TxPurpose, string, number]>;
  e?: {
    msg?: string;
  };
  c?: [string, Buffer]
  pa?: Buffer;
  // return url
  ru?: string;
}
