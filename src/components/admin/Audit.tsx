import React from 'react';
import {useSelector} from 'react-redux';
import {formatDate, t} from '../utils';
import {IAudit} from '../../models';
import {ConfacState} from '../../reducers/app-state';


export const Audit = ({audit}: {audit: IAudit}) => {
  const createdBy = useSelector((state: ConfacState) => state.user.users.find(x => x._id === (audit && audit.createdBy)));
  const modifiedBy = useSelector((state: ConfacState) => state.user.users.find(x => x._id === (audit && audit.modifiedBy)));

  if (!audit) {
    return null;
  }

  if (!audit.createdOn && !audit.modifiedOn) {
    return null;
  }

  return (
    <small className="created-on">
      {audit.createdOn && t('createdOn', {date: formatDate(audit.createdOn, 'DD/MM/YYYY'), hour: formatDate(audit.createdOn, 'H:mm')})}
      {createdBy && t('createdBy', {name: createdBy.alias})}

      {audit.modifiedOn && (
        <>
          {audit.createdOn && <br />}
          {t('modifiedOn', {date: formatDate(audit.modifiedOn), hour: formatDate(audit.modifiedOn, 'H:mm')})}
          {modifiedBy && t('modifiedBy', {name: modifiedBy.alias})}
        </>
      )}
    </small>
  );
};
