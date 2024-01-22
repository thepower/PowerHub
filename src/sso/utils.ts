import * as msgPack from '@thepowereco/msgpack';

export const objectToString = (data: object) => Buffer.from(msgPack.encode(data)).toString('hex');
export const stringToObject = (data: string) => msgPack.decode(Buffer.from(data, 'hex'));
