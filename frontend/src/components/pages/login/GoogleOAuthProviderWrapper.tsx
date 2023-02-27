import React, { useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { buildUrl } from '../../../actions/utils/buildUrl';
import { ACTION_TYPES } from '../../../actions/utils/ActionTypes';
import { SecurityConfigModel } from '../../../models';
import { authService } from '../../users/authService';
import { useInterval } from '../../hooks/useInterval';


/**
 * Wrapper for Google login to wait until clientId is fetched.
 * Only then render the app (with/without GoogleOAuthProvider)
 **/
export const GoogleOAuthProviderWrapper = (props) => {
  const dispatch = useDispatch();
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const [configFetched, setConfigFetched] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(0);

  useEffect(() => {
    // Fetch the googleClientId
    // to then decide to continue with/without security
    fetch(buildUrl('/config/security'))
      .then(res => res.json())
      .then((data: SecurityConfigModel) => {
        const versionInfo = {env: data.env, tag: data.tag, googleClientId: data.googleClientId};
        console.log('version', versionInfo);
        localStorage.setItem('version', JSON.stringify(versionInfo));

        dispatch({type: ACTION_TYPES.SECURITY_CONFIG_FETCHED, payload: data});
        setGoogleClientId(data.googleClientId);
        setRefreshInterval(data.jwtInterval);
        setConfigFetched(true);
      });
  }, [dispatch, setGoogleClientId]);

  // TODO: this should probably move to the LoginPage
  useInterval(() => {
    // Refresh the JWT token
    if (configFetched && googleClientId && refreshInterval) {
      authService.refresh();
    }
  }, refreshInterval * 1000);

  if (!configFetched) {
    return null;
  }

  if (!googleClientId) {
    return props.children;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {props.children}
    </GoogleOAuthProvider>
  );
};
