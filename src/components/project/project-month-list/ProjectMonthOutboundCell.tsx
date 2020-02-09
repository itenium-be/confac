import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {FullProjectMonthModel, ProjectMonthOutbound} from '../models/ProjectMonthModel';
import {patchProjectsMonth, createProjectsMonthInvoice, createInvoice} from '../../../actions';
import {getNewProjectMonthOutbound} from '../models/getNewProject';
import {useDebouncedSave} from '../../hooks/useDebounce';
import {Button} from '../../controls/form-controls/Button';
import {Icon} from '../../controls/Icon';
import {t} from '../../utils';
import {NotesModalButton} from '../../controls/form-controls/button/NotesModalButton';
import InvoiceModel from '../../invoice/models/InvoiceModel';
import { ConfacState } from '../../../reducers/app-state';
import { useHistory } from 'react-router-dom';


interface ProjectMonthOutboundCellProps {
  projectMonth: FullProjectMonthModel;
}


/** Outbound form cell for a ProjectMonth row */
export const ProjectMonthOutboundCell = ({projectMonth}: ProjectMonthOutboundCellProps) => {
  const dispatch = useDispatch();

  const defaultOutbound = projectMonth.details.outbound || getNewProjectMonthOutbound();
  const dispatcher = (val: ProjectMonthOutbound) => {
    dispatch(patchProjectsMonth({...projectMonth.details, outbound: val}));
  };
  const [outbound, setOutbound, saveOutbound] = useDebouncedSave<ProjectMonthOutbound>(defaultOutbound, dispatcher);

  return (
    <div className="outbound-cell">
      {!outbound.invoiceId ? (
        <CreateInvoiceButton projectMonth={projectMonth} />
      ) : (
        <span>{outbound.invoiceId}</span>
      )}


      <NotesModalButton
        value={outbound.note}
        onChange={val => saveOutbound({...outbound, note: val})}
        title={t('projectMonth.outboundNote')}
      />
    </div>
  );
};


interface CreateInvoiceButtonProps {
  projectMonth: FullProjectMonthModel;
}


const CreateInvoiceButton = ({projectMonth}: CreateInvoiceButtonProps) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const config = useSelector((state: ConfacState) => state.config);

  const buildAndCreateInvoice = () => {
    const invoice = new InvoiceModel(config, {
      client: projectMonth.client,
      orderNr: projectMonth.project.client.ref,
      // attachments: [],
      projectId: projectMonth._id,
      consultantId: projectMonth.consultant._id,
    });

    console.log('creating', invoice);

    // dispatch(createInvoice(invoice, history));
  };


  const valid = (
    projectMonth.details.timesheet.validated
    && (projectMonth.details.inbound.status === 'paid' || !projectMonth.project.projectMonthConfig.inboundInvoice)
  );


  return (
    <>
      <Button key="new" variant={valid ? 'success' : 'outline-danger'} onClick={() => buildAndCreateInvoice()} size="md">
        {t('projectMonth.outboundCreateInvoice')}
        <Icon fa="fa fa-file-invoice" size={1} style={{marginLeft: 12}} />
      </Button>
    </>
  );
}
