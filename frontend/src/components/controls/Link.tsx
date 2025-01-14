import {Link as RouterLink} from 'react-router-dom';
import {EnhanceWithClaim} from '../enhancers/EnhanceWithClaim';
import {t} from '../utils';


export type LinkProps = {
  to: string;
  label: string;
  className?: string;
}


export const LinkComponent = ({to, label, ...props}: LinkProps) => (
  <RouterLink to={to} {...props}>
    {t(label)}
  </RouterLink>
);

export const Link = EnhanceWithClaim(LinkComponent);
