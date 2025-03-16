import React, { ReactNode } from 'react';
import {Claim, GenericClaim} from '../users/models/UserModel';
import {authService} from '../users/authService';
import {ChildrenType} from '../../models';


type CustomClaimFn = (claims: Claim[]) => boolean;

type CustomClaim = {
  claim: Claim;
  /** Fallback when claim is not present */
  or: null | React.ReactElement | 'disabled';
}


export type EnhanceWithClaimProps = {
  claim?: Claim | CustomClaimFn | CustomClaim;
  children?: ChildrenType;
}


export const EnhanceWithClaim = <P extends object>(Component: React.ComponentType<P>) =>
  class WithClaim extends React.Component<P & EnhanceWithClaimProps> {
    render() {
      const {claim, ...props} = this.props;
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
            return <Component {...props as P} disabled />;
          }
          return claim.or;
        }
      }
      return <Component {...props as P} />;
    }
  };



type ClaimGuardProps = {
  feature?: {key: string, claim: GenericClaim};
  claim?: Claim;
  children: any;
}

export const ClaimGuard = ({feature, claim, children}: ClaimGuardProps) => {
  if (!hasClaim(feature, claim)) {
    return null;
  }

  return children;
};


export type ClaimGuardSwitchProps = {
  feature?: {key: string, claim: GenericClaim};
  children: ReactNode;
}
export const ClaimGuardSwitch = ({feature, children}: ClaimGuardSwitchProps) => {
  if (React.Children.count(children) === 0) {
    return null;
  }

  const claimGuards = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === ClaimGuard
  ) as React.ReactElement<ClaimGuardProps>[];

  for (const claimGuard of claimGuards) {
    const { feature: guardFeature, claim, children: guardChildren } = claimGuard.props;

    if (hasClaim(guardFeature ?? feature, claim)) {
      return guardChildren;
    }
  }

  return null;
}



function mapClaim(entity: string, claim: GenericClaim): Claim {
  return Claim[`${claim}-${entity}`];
}

function hasClaim(feature?: {key: string, claim: GenericClaim}, claim?: Claim ): boolean {
  if (feature) {
    const realClaim = mapClaim(feature.key, feature.claim);
    const claims = authService.getClaims();

    if (!claims.includes(realClaim) && !claims.map(x => x.toString()).includes(`manage-${feature.key}`)) {
      return false;
    }
  }

  if (claim) {
    const claims = authService.getClaims();
    if (!claims.includes(claim)) {
      return false;
    }
  }

  return true;
}
