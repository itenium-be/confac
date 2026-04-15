import {Link} from 'react-router';
import {authService} from '../../users/authService';
import {Redirecter} from './Redirecter';

type UnauthicatedAppLayoutProps = {
  Component: React.ComponentType;
};

/** Entire page wrapper for pages when not logged in (ie login page) */
export const UnauthicatedAppLayout = ({Component}: UnauthicatedAppLayoutProps) => {
  if (authService.loggedIn()) {
    return <Redirecter />;
  }

  return (
    <div className="container unauthicated">
      <Link to="/">
        <img src="/img/itenium.svg" role="presentation" alt="itenium logo" height={30} />
      </Link>
      <hr />
      <Component />
    </div>
  );
};
