import React, { useCallback } from 'react';
import { Button } from '../../controls/form-controls/Button';
import { t } from '../../utils';
import { useDispatch } from 'react-redux';
import { updateAppProjectMonthsFilter } from '../../../actions';

/** Opens/closes a projectMonth */
export const ToggleProjectMonthButton = ({ month, toggleOpen }: { month: string; toggleOpen: boolean }) => {
  const dispatch = useDispatch();

  const onToggle = () => {
    dispatch(updateAppProjectMonthsFilter(month, toggleOpen));
  };

  if (!toggleOpen) {
    return (
      <Button onClick={onToggle} icon="fa fa-toggle-on" variant="outline-info">
        {t('projectMonth.list.closeList')}
      </Button>
    );
  }

  return (
    <Button onClick={onToggle} icon="fa fa-toggle-off" variant="outline-info">
      {t('projectMonth.list.openList')}
    </Button>
  );
};
