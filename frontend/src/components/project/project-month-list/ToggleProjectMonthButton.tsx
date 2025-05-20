import {t} from '../../utils';
import {useDispatch} from 'react-redux';
import {updateAppProjectMonthsFilter} from '../../../actions';

const style = {marginRight: 6};

/** Opens/closes a projectMonth */
export const ToggleProjectMonthButton = ({month, toggleOpen}: { month: string; toggleOpen: boolean }) => {
  const dispatch = useDispatch();
  // This was actually slower in a test?
  // const onToggle = useCallback(() => {
  //   dispatch(updateAppProjectMonthsFilter(month, toggleOpen));
  // }, [dispatch, month, toggleOpen]);

  const onToggle = () => {
    dispatch(updateAppProjectMonthsFilter(month, toggleOpen));
  };

  if (!toggleOpen) {
    return (
      <button type="button" onClick={onToggle} className="btn btn-outline-info tst-toggle-close-project">
        <i className="fa fa-toggle-on fa-1x tst-icon-toggle-on" style={style} />
        {t('projectMonth.list.closeList')}
      </button>
    );
  }

  return (
    <button type="button" onClick={onToggle} className="btn btn-outline-info tst-toggle-open-project">
      <i className="fa fa-toggle-off fa-1x tst-icon-toggle-off" style={style} />
      {t('projectMonth.list.openList')}
    </button>
  );
};
