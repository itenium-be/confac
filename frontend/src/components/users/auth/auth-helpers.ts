import { getRoles } from "../../../reducers";
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

const requiredClaimsForFakeUser: Claim[] = [
  Claim.ViewUsers,
  Claim.ManageUsers,
  Claim.ViewRoles,
  Claim.ManageRoles
]

export function getFakeClaims() {
  const adminClaims = getRoles().filter(role => role.name === 'admin').map(x => x.claims).flat();
  const uniqueSet = new Set([...adminClaims, ...requiredClaimsForFakeUser]);
  return Array.from(uniqueSet);
}
