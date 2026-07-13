import {useState} from 'react';
import {Container, Form, Row} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import moment from 'moment';
import {Button} from '../../controls/form-controls/Button';
import {Modal} from '../../controls/Modal';
import {MonthPicker} from '../../controls/form-controls/MonthPicker';
import {t} from '../../utils';
import {downloadTimesheetExcel} from '../../../actions/downloadActions';
import {selectAllProjectMonths} from '../../project/project-month-list/createFullProjectMonthsSelector';
import {ConfacState} from '../../../reducers/app-state';
import {useAppDispatch} from '../../hooks/useAppDispatch';
import {getTimesheetExcelRows} from './getTimesheetExcelRows';


export const TimesheetExcelButton = () => {
  const [modal, setModal] = useState(false);
  return (
    <>
      <Button
        variant="light"
        onClick={() => setModal(true)}
        title={t('consultant.timesheetExcel.title')}
        icon="fa fa-file-excel"
        className="tst-timesheet-excel"
      />

      {modal && <TimesheetExcelModal onClose={() => setModal(false)} />}
    </>
  );
};


type TimesheetExcelModalProps = {
  onClose: () => void;
}


const TimesheetExcelModal = ({onClose}: TimesheetExcelModalProps) => {
  const [from, setFrom] = useState<moment.Moment>(moment().startOf('month'));
  const [to, setTo] = useState<moment.Moment | null>(null);
  const dispatch = useAppDispatch();
  const projectMonths = useSelector(selectAllProjectMonths);
  const users = useSelector((state: ConfacState) => state.user.users);
  const currentLastMonths = useSelector((state: ConfacState) => state.app.lastMonthsDownloaded);

  const download = () => {
    const rows = getTimesheetExcelRows(projectMonths, users, from, to);
    dispatch(downloadTimesheetExcel(rows, from.format('YYYY-MM'), (to || moment()).format('YYYY-MM')));
  };

  return (
    <Modal
      show
      onClose={onClose}
      onConfirm={download}
      confirmText={t('consultant.timesheetExcel.download')}
      title={t('consultant.timesheetExcel.title')}
    >
      <Form>
        <p>
          <i className="fa fa-database text-info" style={{marginRight: 8}} />
          {t('dataLoad.monthsLoaded', {months: currentLastMonths})}
        </p>
        <Container>
          <Row>
            <MonthPicker
              label={t('consultant.timesheetExcel.from')}
              value={from}
              onChange={value => value && setFrom(value)}
            />
          </Row>
          <Row>
            <MonthPicker
              label={t('consultant.timesheetExcel.to')}
              value={to}
              onChange={value => setTo(value)}
            />
          </Row>
        </Container>
      </Form>
    </Modal>
  );
};
