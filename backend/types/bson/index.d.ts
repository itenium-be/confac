declare module 'bson' {
  export class ObjectId {
    constructor(id?: string | number | ObjectId);
    toHexString(): string;
    toString(): string;
    equals(otherId: ObjectId): boolean;
    static createFromHexString(hexString: string): ObjectId;
    static isValid(id: any): boolean;
  }
}
