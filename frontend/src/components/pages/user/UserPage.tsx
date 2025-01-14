import {t} from '../../utils';
import {authService} from '../../users/authService';
import {Button} from '../../controls/form-controls/Button';
import {Icon} from '../../controls/Icon';
import {Claim} from '../../users/models/UserModel';
import { AnonymousLogoutButton } from './AnonymousLogoutButton';
import { LogoutButton } from './LogoutButton';
import { UserSettings } from './UserSettings';

/** Full user profile page */
export const UserPage = () => {
  return (
    <div className="container">
      <Button className="tst-view-users" claim={Claim.ViewUsers} onClick="/users" style={{float: 'right'}} variant="light">
        {t('user.users')}
        <Icon fa="fa fa-arrow-right" size={1} style={{marginLeft: 8}} />
      </Button>
      {localStorage.getItem('googleClientId') ? <LogoutButton /> : <AnonymousLogoutButton />}

      <UserSettings />

      <h2 style={{marginTop: 34}}>JWT</h2>
      <pre>
        {JSON.stringify(authService.getToken(), null, 3)}
      </pre>
    </div>
  );
};
