import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {ConfacState} from '../../reducers/app-state';
import {Button} from '../controls/form-controls/Button';
import {EnhanceWithClaim} from '../enhancers/EnhanceWithClaim';
import {t} from '../utils';
import {Modal} from '../controls/Modal';
import {initialLoad} from '../../actions';


import './DataLoaded.scss';


const NextLoadMonths = 12;


const DataLoadedComponent = () => {
  const dispatch = useDispatch();
  // const initialMonthLoad = useSelector((state: ConfacState) => state.config.initialMonthLoad);
  const currentLastMonths = useSelector((state: ConfacState) => state.app.lastMonthsDownloaded);

  const [open, setOpen] = useState(false);
  // const lastMonths = currentLastMonths || initialMonthLoad;
  const nextLoadMonths = (currentLastMonths || 0) + NextLoadMonths;

  return (
    <div className="data-loader">
      <Button
        className="btn btn-info tst-open-extra-data-loader"
        title={t('dataLoad.monthsLoaded', {months: currentLastMonths})}
        onClick={() => setOpen(true)}
        icon="fa fa-database"
      />
      {open && (
        <Modal
          show
          onClose={() => setOpen(false)}
          title={t('dataLoad.loadMore')}
        >
          <p>
            <i className="fa fa-database text-info" style={{marginRight: 8}} />
            {t('dataLoad.monthsLoaded', {months: currentLastMonths})}
          </p>
          <Button
            className="btn btn-success tst-load-next-months"
            title={t('dataLoad.monthsLoaded', {months: currentLastMonths})}
            onClick={() => {
              dispatch(initialLoad(nextLoadMonths));
            }}
          >

            {t('dataLoad.loadNextMonths', {months: NextLoadMonths})}
          </Button>
        </Modal>
      )}
    </div>
  );
}

export const DataLoaded = EnhanceWithClaim(DataLoadedComponent);
