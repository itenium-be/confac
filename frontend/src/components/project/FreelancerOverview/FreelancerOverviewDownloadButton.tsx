import {useState} from 'react';
import {Form} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import {Button} from '../../controls/form-controls/Button';
import {t} from '../../utils';
import {Modal} from '../../controls/Modal';
import {ConsultantSelect} from '../../consultant/controls/ConsultantSelect';
import {ConsultantModel} from '../../consultant/models/ConsultantModel';
import {downloadProjectsMonthsFreelancerExcel} from '../../../actions/downloadActions';
import {selectAllProjectMonths} from '../project-month-list/createFullProjectMonthsSelector';
import {ConfacState} from '../../../reducers/app-state';
import {useAppDispatch} from '../../hooks/useAppDispatch';


export const FreelancerOverviewDownloadButton = () => {
  const [modal, setModal] = useState(false);
  return (
    <>
      <Button
        variant="light"
        onClick={() => setModal(true)}
        title={t('projectMonth.freelancerOverview.title')}
        icon="fa fa-file-excel"
      />

      {modal && <FreelancerOverviewModal onClose={() => setModal(false)} />}
    </>
  );
};



type FreelancerOverviewModalProps = {
  onClose: () => void;
}

const FreelancerOverviewModal = ({onClose}: FreelancerOverviewModalProps) => {
  const [consultant, setConsultant] = useState<ConsultantModel>();
  const dispatch = useAppDispatch();
  const allProjectMonths = useSelector(selectAllProjectMonths);
  const currentLastMonths = useSelector((state: ConfacState) => state.app.lastMonthsDownloaded);

  const getData = (freelancer?: ConsultantModel) => {
    let filteredProjectMonths = allProjectMonths;
    if (freelancer?._id) {
      filteredProjectMonths = allProjectMonths.filter(fp => fp.consultant._id === freelancer._id);
    } else {
      filteredProjectMonths = allProjectMonths.filter(fp => fp.consultant.type !== 'consultant');
    }
    const incoming = filteredProjectMonths
      .filter(fp => fp.details.inbound)
      .map(fp => [
        fp.consultantName,
        fp.consultant.type,
        fp.client.name,
        fp.details.month.format('YYYY-MM'),
        t('projectMonth.freelancerOverview.invoiceType'),
        fp.details.timesheet.timesheet ?? 0,
        fp.project.partner?.defaultInvoiceLines[0].price,
        null,
        fp.project.partner?.defaultInvoiceLines[0].tax ?? 0,
        null,
        fp.details.inbound.nr,
        fp.details.inbound.dateReceived,
        fp.details.inbound.status,
        fp.project.startDate,
        fp.project.endDate,
        fp.accountManager?.alias,
      ]);

    return incoming;
  };

  return (
    <Modal
      show
      onClose={onClose}
      onConfirm={() => dispatch(downloadProjectsMonthsFreelancerExcel(getData(consultant), consultant))}
      confirmText={t('projectMonth.freelancerOverview.download')}
      title={t('projectMonth.freelancerOverview.title')}
    >
      <Form className="email-form">
        <p>
          <i className="fa fa-database text-info" style={{marginRight: 8}} />
          {t('dataLoad.monthsLoaded', {months: currentLastMonths})}
        </p>
        <Form.Label>
          {t('projectMonth.freelancerOverview.select')}
        </Form.Label>
        <ConsultantSelect value={consultant || ''} onChange={(id, model) => setConsultant(model)} />
      </Form>
    </Modal>
  );
};
