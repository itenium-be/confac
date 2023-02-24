import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';
import {GoogleLogout} from '@leecheuk/react-google-login';
import {t} from '../utils';
import {authService} from '../users/authService';
import {Button} from '../controls/form-controls/Button';
import {Icon} from '../controls/Icon';
import {Claim} from '../users/models/UserModel';
import {ConfacState} from '../../reducers/app-state';
import {NumericInput} from '../controls/form-controls/inputs/NumericInput';
import {useDispatch} from 'react-redux';
import {ACTION_TYPES} from '../../actions';


export const UserPage = () => {
  return (
    <div className="container">
      <Button claim={Claim.ViewUsers} onClick="/users" style={{float: 'right'}} variant="light">
        {t('user.users')}
        <Icon fa="fa fa-arrow-right" size={1} style={{marginLeft: 8}} />
      </Button>
      <Logout />

      <UserSettings />

      <h2 style={{marginTop: 34}}>JWT</h2>
      <pre>
        {JSON.stringify(authService.getToken(), null, 3)}
      </pre>
    </div>
  );
};



const UserSettings = () => {
  const dispatch = useDispatch();
  const listSize = useSelector((state: ConfacState) => state.app.settings.listSize);

  return (
    <div className="row">
      <h2 style={{marginTop: 34}}>Instellingen</h2>

      <div className="col-6">
      <NumericInput
        label={'Aantal records per pagina tonen'}
        value={listSize}
        onChange={value => dispatch({type: ACTION_TYPES.APP_SETTINGS_UPDATED, payload: {listSize: value}})}
      />
      </div>
    </div>
  );
}



export const Logout = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(true);

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  const logout = () => {
    authService.logout();
    setLoggedIn(false);
  };

  return (
    <GoogleLogout
      clientId={localStorage.getItem('googleClientId') || ''}
      buttonText={t('user.logout')}
      onLogoutSuccess={logout}
      onFailure={logout}
    />
  );
};
