import base64url from 'base64url';

export const objectToString = (data: object) => base64url.encode(JSON.stringify(data));
export const stringToObject = (data: string) => JSON.parse(base64url.decode(data));
