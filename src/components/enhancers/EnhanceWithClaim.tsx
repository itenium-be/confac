import React from 'react';
import {Claim, GenericClaim} from '../users/models/UserModel';
import {authService} from '../users/authService';


type CustomClaimFn = (claims: Claim[]) => boolean;

type CustomClaim = {
  claim: Claim;
  or: null | React.ReactElement | 'disabled';
}


export type EnhanceWithClaimProps = {
  claim?: Claim | CustomClaimFn | CustomClaim;
}

// eslint-disable-next-line max-len
export const EnhanceWithClaim = <P extends object>(ComposedComponent: React.ComponentType<P>) => ({claim, ...props}: EnhanceWithClaimProps & P) => {
  if (claim) {
    const claims = authService.getClaims();
    if (typeof claim === 'string' && !claims.includes(claim)) {
      return null;
    }

    if (typeof claim === 'function' && !claim(claims)) {
      return null;
    }

    if (typeof claim === 'object' && !claims.includes(claim.claim)) {
      if (claim.or === 'disabled') {
        return <ComposedComponent {...props as P} disabled />;
      }
      return claim.or;
    }
  }
  return <ComposedComponent {...props as P} />;
};



type ClaimGuardProps = {
  feature?: {key: string, claim: GenericClaim};
  claim?: Claim;
  children: any;
}

export const ClaimGuard = ({feature, claim, children}: ClaimGuardProps) => {
  if (feature) {
    const realClaim = mapClaim(feature.key, feature.claim);
    const claims = authService.getClaims();

    if (!claims.includes(realClaim) && !claims.map(x => x.toString()).includes(`manage-${feature.key}`)) {
      return null;
    }
  }

  if (claim) {
    const claims = authService.getClaims();
    if (!claims.includes(claim)) {
      return null;
    }
  }

  return children;
};


function mapClaim(entity: string, claim: GenericClaim): Claim {
  return Claim[`${claim}-${entity}`];
}
