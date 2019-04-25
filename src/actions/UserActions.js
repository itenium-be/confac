import request from 'superagent-bluebird-promise';

import {ACTION_TYPES} from './ActionTypes.js';
import {busyToggle} from './appActions.js';
import {buildUrl, catchHandler} from './fetch.js';

export function authenticateUser(data) {
    console.log('we in here \n' + data)
    return dispatch => {
      dispatch(busyToggle());
      console.log('we in the dispatch \n' + data)
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