import {useState} from 'react';
import {useSelector} from 'react-redux';
import moment, {Moment} from 'moment';
import {Col} from 'react-bootstrap';
import {t} from '../../utils';
import {ConfacState} from '../../../reducers/app-state';
import {FullProjectMonthModel} from '../models/FullProjectMonthModel';
import InvoiceModel, {InvoiceProjectMonth} from '../../invoice/models/InvoiceModel';
import {ProjectMonthSelect} from './ProjectMonthSelect';
import {ConsultantModel} from '../../consultant/models/ConsultantModel';
import {ConsultantSelect} from '../../consultant/controls/ConsultantSelect';
import {MonthPicker} from '../../controls/form-controls/MonthPicker';
import {Icon} from '../../controls/Icon';




type ProjectMonthOrManualSelectProps = {
  /** The invoice.projectMonth */
  value?: InvoiceProjectMonth,
  onProjectMonthChange: (fullProjectMonth: FullProjectMonthModel) => void,
  onManualChange: (consultant?: ConsultantModel, month?: Moment | null) => void,
  /** Currently selected Invoice */
  invoice?: InvoiceModel;
}



/** Select a projectMonthId or a ProjectId & Month */
export const ProjectMonthOrManualSelect = (props: ProjectMonthOrManualSelectProps) => {
  const displayProjectMonthSelect = !!props.invoice?.projectMonth?.projectMonthId;
  const consultant = useSelector((state: ConfacState) => state.consultants.find(x => x._id === props.value?.consultantId));
  const [toggle, setToggle] = useState<'projectMonth' | 'manual'>(displayProjectMonthSelect ? 'projectMonth' : 'manual');

  if (!props.invoice)
    return null;

  const SwitchComponent = (
    <>
      <Icon
        title={t('invoice.toggleProjectMonth')}
        className={'fa fa-toggle-' + (toggle ? 'on' : 'off') + ' tst-toggle-month'}
        style={{marginRight: 8, cursor: 'pointer', fontSize: 18}}
        onClick={() => {
          setToggle(toggle === 'projectMonth' ? 'manual' : 'projectMonth');
          props.onManualChange();
        }}
      />
      {t('projectMonth.selectLabel')}
    </>
  );

  if (toggle === 'projectMonth') {
    return (
      <ProjectMonthSelect
        label={SwitchComponent}
        placeholder={t('projectMonth.selectLabel')}
        value={props.invoice?.projectMonth?.projectMonthId || ''}
        onChange={newProjectMonth => {
          props.onProjectMonthChange(newProjectMonth);
        }}
        invoice={props.invoice}
      />
    );
  }

  const projectMonth = props.invoice.projectMonth?.month;
  return (
    <>
      <Col sm={5}>
        <MonthPicker
          label={SwitchComponent}
          placeholder={t('projectMonth.selectLabel')}
          value={projectMonth && moment(projectMonth)}
          onChange={newMonth => props.onManualChange(consultant, newMonth)}
        />
      </Col>
      <Col sm={7}>
        <ConsultantSelect
          label={t('invoice.consultant')}
          value={props.value?.consultantId || ''}
          onChange={(id, model) => props.onManualChange(model, props.value?.month)}
        />
      </Col>
    </>
  );
};
