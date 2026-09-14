import {useState} from 'react';
import {useSelector} from 'react-redux';
import moment from 'moment';
import {useAppDispatch} from '../../../hooks/useAppDispatch';
import {Modal, BaseModalProps} from '../../../controls/Modal';
import {EmailForm} from '../../../controls/email/EmailForm';
import {t} from '../../../utils';
import {ConfacState} from '../../../../reducers/app-state';
import {FullProjectMonthModel} from '../../models/FullProjectMonthModel';
import {getTimesheetReminderEmail} from '../timesheet-reminder';
import {sendTimesheetReminderEmail} from '../../../../actions/emailActions';


type TimesheetReminderModalProps = Omit<BaseModalProps, 'show'> & {
  projectMonths: FullProjectMonthModel[];
  month: moment.Moment;
};


export const TimesheetReminderModal = ({projectMonths, month, onClose}: TimesheetReminderModalProps) => {
  const dispatch = useAppDispatch();
  const config = useSelector((state: ConfacState) => state.config);
  const [value, setValue] = useState(() => getTimesheetReminderEmail(projectMonths, month, config));

  return (
    <Modal
      show
      onClose={onClose}
      onConfirm={() => void dispatch(sendTimesheetReminderEmail(value))}
      confirmText={t('email.send')}
      confirmVariant="danger"
      title={t('projectMonth.timesheetReminderModalTitle', {month: month.format('MMMM YYYY')})}
    >
      <EmailForm value={value} onChange={setValue} showCcBcc />
    </Modal>
  );
};
