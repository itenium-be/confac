import { Claim } from "../models/UserModel";

export function getFakeJwtToken(name: string) {
  return {
    iat: 0,
    exp: 0,
    data: {
      _id: name,
      email: name + '@itenium.be',
      name: 'X',
      firstName: name,
      alias: name,
      active: true,
      roles: ['admin'],
      audit: {
        createdOn: new Date().toISOString(),
        createdBy: name,
      },
    }
  };
}

export function getFakeClaims() {
  return Object.keys(Claim).filter(key => Number.isNaN(Number(key))).map(key => Claim[key]);
}
