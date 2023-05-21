export const objectToString = (data: object) => Buffer.from(encodeURI(JSON.stringify(data))).toString('base64');
export const stringToObject = (data: string) => JSON.parse(decodeURI(Buffer.from(data, 'base64').toString()));
