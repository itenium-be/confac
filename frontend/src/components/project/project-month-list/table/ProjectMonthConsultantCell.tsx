import {useState} from 'react';
import {Link} from 'react-router';
import {FullProjectMonthModel} from '../../models/FullProjectMonthModel';
import {ProjectMonthModal} from '../../controls/ProjectMonthModal';
import {ConsultantLink} from '../../../consultant/controls/ConsultantLink';
import {Icon} from '../../../controls/Icon';
import {t} from '../../../utils';


interface ProjectMonthConsultantCellProps {
  fullProjectMonth: FullProjectMonthModel;
}


/** The first cell with Consultant/Client/Partner info of a ProjectMonth */
export const ProjectMonthConsultantCell = ({fullProjectMonth}: ProjectMonthConsultantCellProps) => {
  const [modal, setModal] = useState<boolean>(false);
  const {consultant, client, partner} = fullProjectMonth;
  return (
    <>
      {modal && (
        <ProjectMonthModal
          onClose={() => setModal(false)}
          projectMonth={fullProjectMonth}
        />
      )}
      <div className="consultant-cell clickable" onClick={() => setModal(true)} role="button" tabIndex={0}>
        <div>
          <ConsultantLink consultant={consultant} />
          {!consultant.accountingCode && (
            <Icon
              fa="fa fa-exclamation-triangle"
              size={1}
              color="#CC1100"
              title={t('projectMonth.missingAccountingCode')}
              style={{marginLeft: 6}}
            />
          )}
        </div>
        <small>
          {partner && (
            <Link to={`/clients/${partner.slug || partner._id}`}>{partner.name}</Link>
          )}
          {partner && client && ' / '}
          {client && (
            <Link to={`/clients/${client.slug || client._id}`}>{client.name}</Link>
          )}
        </small>
      </div>
    </>
  );
};
