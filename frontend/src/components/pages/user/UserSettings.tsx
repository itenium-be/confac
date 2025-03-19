import { useSelector } from 'react-redux';
import { ConfacState } from '../../../reducers/app-state';
import { NumericInput } from '../../controls/form-controls/inputs/NumericInput';
import { useDispatch } from 'react-redux';
import { ACTION_TYPES } from '../../../actions';

/** UserPage: change app settings */
export const UserSettings = () => {
  const dispatch = useDispatch();
  const listSize = useSelector((state: ConfacState) => state.app.settings.listSize);

  return (
    <div className="row">
      <h2 style={{marginTop: 34}}>Instellingen</h2>

      <div className="col-6">
        <NumericInput
          label={'Aantal records per pagina tonen'}
          value={listSize}
          onChange={value => dispatch({ type: ACTION_TYPES.APP_SETTINGS_UPDATED, payload: { listSize: value } })} />
      </div>
    </div>
  );
};
