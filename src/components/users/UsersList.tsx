import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {ConfacState} from '../../reducers/app-state';
import {ListPage} from '../controls/table/ListPage';
import {userFeature, UserFeatureBuilderConfig} from './models/getUserFeature';
import {saveUser} from '../../actions/userActions';
import {updateAppFilters} from '../../actions';
import {useDocumentTitle} from '../hooks/useDocumentTitle';


export const UsersList = () => {
  useDocumentTitle('usersList');

  const dispatch = useDispatch();
  const models = useSelector((state: ConfacState) => ({filters: state.app.filters.users, data: state.user.users}));

  const config: UserFeatureBuilderConfig = {
    data: models.data,
    save: m => dispatch(saveUser(m)),
    filters: models.filters,
    setFilters: f => dispatch(updateAppFilters('users', f)),
  };

  const feature = userFeature(config);

  return (
    <ListPage feature={feature} />
  );
};
