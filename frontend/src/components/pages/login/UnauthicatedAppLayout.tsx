import {Link} from 'react-router';
import {authService} from '../../users/authService';
import {Redirecter} from './Redirecter';


/** Entire page wrapper for pages when not logged in (ie login page) */
export const UnauthicatedAppLayout = ({Component, props}: any) => {
  if (authService.loggedIn()) {
    return <Redirecter />;
  }

  return (
    <div className="container unauthicated">
      <Link to="/">
        <img src="/img/itenium.png" role="presentation" alt="itenium logo" />
      </Link>
      <hr />
      <Component {...props} />
    </div>
  );
};
