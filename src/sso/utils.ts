import * as msgPack from '@thepowereco/msgpack';

const codec = msgPack.createCodec({
  usemap: true,
});

const options = { codec };

export const objectToString = (data: object) => Buffer.from(msgPack.encode(data, options)).toString('hex');
export const stringToObject = (data: string) => msgPack.decode(Buffer.from(data, 'hex'));
