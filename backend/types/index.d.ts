declare module '@faker-js/faker';

declare module 'bson' {
  export class ObjectId {
    constructor(id?: string | number | ObjectId);
    toHexString(): string;
    equals(other: ObjectId): boolean;
    static createFromTime(time: number): ObjectId;
    static createFromHexString(hexString: string): ObjectId;
    static isValid(id: string | number | ObjectId): boolean;
    getTimestamp(): Date;
    toString(): string;
  }
}
