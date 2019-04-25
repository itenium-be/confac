import request from 'superagent-bluebird-promise';
import {browserHistory} from 'react-router';

import {ACTION_TYPES} from './ActionTypes.js';
import {busyToggle} from './appActions.js';
import {buildUrl, catchHandler} from './fetch.js';

export function authenticateUser(data) {
    return dispatch => {
      dispatch(busyToggle());
      alert('we in here \n' + data)
      request.post(buildUrl('/user/auth'))
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(data)
        .then(function(res) {
          dispatch({
            type: ACTION_TYPES.USER_AUTHENTICATE_SUCCESS,
            token: res.body
          }); 
        })
        .catch(catchHandler)
        .then(() => dispatch(busyToggle.off()));
    };
  }