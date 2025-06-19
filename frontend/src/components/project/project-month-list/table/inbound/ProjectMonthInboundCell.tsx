import moment from 'moment';
import {useDispatch} from 'react-redux';
import cn from 'classnames';
import {ProjectMonthInbound} from '../../../models/ProjectMonthModel';
import {FullProjectMonthModel} from '../../../models/FullProjectMonthModel';
import {StringInput} from '../../../../controls/form-controls/inputs/StringInput';
import {getNewProjectMonthInbound} from '../../../models/getNewProject';
import {t} from '../../../../utils';
import {DatePicker} from '../../../../controls/form-controls/DatePicker';
import {patchProjectsMonth, projectMonthUpload} from '../../../../../actions';
import {useDebouncedSave} from '../../../../hooks/useDebounce';
import {getDownloadUrl} from '../../../../../actions/utils/download-helpers';
import {AttachmentUploadPreviewButtons} from '../../../controls/AttachmentUploadPreviewButtons';
import {InboundInvoiceAttachmentType, ProformaInvoiceAttachmentType} from '../../../../../models';
import {ToClipboardLabel} from '../../../../controls/other/ToClipboardLabel';
import {ProjectMonthInboundStatusSelect} from '../../../controls/ProjectMonthInboundStatusSelect';
import {ProformaForecast} from '../ProformaForecast';
import {ProjectMonthProformaStatusSelect} from '../../../controls/ProjectMonthProformaStatusSelect';
import {InboundAmountForecast} from './InboundAmountForecast';


interface ProjectMonthInboundCellProps {
  fullProjectMonth: FullProjectMonthModel;
}


/** Invoice transfer free text comment does not allow underscores */
function sanitizeForInvoiceComment(text: string): string {
  return text.replace(/_/g, '-');
}


/** Inbound form cell for the ProjectMonth list */
export const ProjectMonthInboundCell = ({fullProjectMonth}: ProjectMonthInboundCellProps) => {
  const dispatch = useDispatch();

  const defaultValue = fullProjectMonth.details.inbound || getNewProjectMonthInbound();
  const dispatcher = (val: ProjectMonthInbound) => {
    dispatch(patchProjectsMonth({...fullProjectMonth.details, inbound: val}) as any);
  };
  const [inbound, setInbound, saveInbound] = useDebouncedSave<ProjectMonthInbound>(defaultValue, dispatcher);

  if (!fullProjectMonth.project.projectMonthConfig.inboundInvoice && !fullProjectMonth.details.inbound.proforma) {
    return <div />;
  }

  if (fullProjectMonth.details.verified === 'forced') {
    return <div />;
  }

  const canEdit = inbound.status !== 'new' ? 'label' : undefined;
  const attachments = fullProjectMonth.invoice ? fullProjectMonth.invoice.attachments : fullProjectMonth.details.attachments;
  const inboundInvoiceDetails = attachments.find(a => a.type === InboundInvoiceAttachmentType);

  const getInboundInvoiceDownloadUrl = (): string => {
    if (!inboundInvoiceDetails) {
      return '';
    }

    if (fullProjectMonth.invoice) {
      return getDownloadUrl('invoice', fullProjectMonth.invoice._id,
        InboundInvoiceAttachmentType, inboundInvoiceDetails.fileName, 'preview');
    }

    const projectMonthId = fullProjectMonth._id;
    return getDownloadUrl('project_month', projectMonthId, InboundInvoiceAttachmentType, inboundInvoiceDetails.fileName, 'preview');
  };

  const hasInboundInvoiceBeenUploaded = !!inboundInvoiceDetails;
  const hasInboundInvoice = fullProjectMonth.project.projectMonthConfig.inboundInvoice;
  const inboundValidated = !hasInboundInvoice || fullProjectMonth.details.inbound.status === 'paid';
  const proformaValidated = !fullProjectMonth.details.inbound.proforma || fullProjectMonth.details.inbound.proforma.status === 'verified';
  let inboundInvoiceStyle: string | undefined = inboundValidated && !proformaValidated ? 'validated' : undefined;
  if (!inboundInvoiceStyle && fullProjectMonth.details.inbound.status === 'validated') {
    inboundInvoiceStyle = 'warning';
  }

  return (
    <>
      {hasInboundInvoice && (
        <div className={cn('inbound-cell', inboundInvoiceStyle)}>
          <span className="amount-label">
            {canEdit === 'label' ? (
              <ToClipboardLabel label={inbound.nr} />
            ) : (
              <StringInput
                value={inbound.nr}
                onChange={nr => setInbound({...inbound, nr: sanitizeForInvoiceComment(nr)})}
                placeholder={t('projectMonth.inboundInvoiceNr')}
              />
            )}
          </span>
          <InboundAmountForecast fullProjectMonth={fullProjectMonth} />
          <DatePicker
            value={fullProjectMonth.details.inbound.dateReceived || inbound.dateReceived}
            onChange={dateReceived => setInbound({...inbound, dateReceived})}
            placeholder={t('projectMonth.inboundDateReceived')}
            display={canEdit}
          />
          <div className="inbound-actions">
            <ProjectMonthInboundStatusSelect
              value={fullProjectMonth.details.inbound.status}
              onChange={status => saveInbound({...inbound, status})}
            />
            <div className="inbound-attachment-actions">
              <AttachmentUploadPreviewButtons
                isUploadDisabled={fullProjectMonth.details.inbound.status !== 'new'}
                isPreviewDisabled={!hasInboundInvoiceBeenUploaded}
                uploadTooltip={t('projectMonth.inboundUpload')}
                previewTooltip={t('projectMonth.viewInboundInvoice', {fileName: inboundInvoiceDetails ? inboundInvoiceDetails.fileName : ''})}
                onUpload={f => {
                  if (!inbound.dateReceived) {
                    setInbound({...inbound, dateReceived: moment()});
                  }

                  const inboundFileName = '{month}-{partner}-{consultant}-Proforma'
                    .replace('{partner}', (fullProjectMonth.partner && fullProjectMonth.partner.name) || '')
                    .replace('{client}', fullProjectMonth.client.name)
                    .replace('{consultant}', `${fullProjectMonth.consultant.firstName} ${fullProjectMonth.consultant.name}`)
                    .replace('{month}', fullProjectMonth.details.month.format('YYYY-MM'))
                    + f.name.substring(f.name.lastIndexOf('.'));

                  return dispatch(projectMonthUpload(f, InboundInvoiceAttachmentType, fullProjectMonth, inboundFileName) as any);
                }}
                downloadUrl={getInboundInvoiceDownloadUrl()}
              />
            </div>
          </div>
        </div>
      )}
      <ProjectMonthInboundCellProforma projectMonth={fullProjectMonth} inbound={inbound} saveInbound={saveInbound} />
    </>
  );
};






type ProjectMonthInboundCellProformaProps = {
  projectMonth: FullProjectMonthModel;
  inbound: ProjectMonthInbound;
  saveInbound: (model: ProjectMonthInbound) => void;
}



const ProjectMonthInboundCellProforma = ({projectMonth, saveInbound, inbound}: ProjectMonthInboundCellProformaProps) => {
  const dispatch = useDispatch();

  if (!projectMonth.details.inbound.proforma) {
    return null;
  }

  const attachments = projectMonth.invoice ? projectMonth.invoice.attachments : projectMonth.details.attachments;
  const proformaInvoiceDetails = attachments.find(a => a.type === ProformaInvoiceAttachmentType);

  const getProformaDownloadUrl = (): string => {
    if (!proformaInvoiceDetails)
      return '';

    if (projectMonth.invoice) {
      return getDownloadUrl('invoice', projectMonth.invoice._id, ProformaInvoiceAttachmentType, proformaInvoiceDetails.fileName, 'preview');
    }

    return getDownloadUrl('project_month', projectMonth._id, ProformaInvoiceAttachmentType, proformaInvoiceDetails.fileName, 'preview');
  };

  const hasProformaInvoiceBeenUploaded = !!proformaInvoiceDetails;
  const proformaValidated = projectMonth.details.inbound.proforma?.status === 'verified';
  const hasInboundInvoice = projectMonth.project.projectMonthConfig.inboundInvoice;
  const inboundValidated = !hasInboundInvoice || projectMonth.details.inbound.status === 'paid' || projectMonth.details.verified === 'forced';

  return (
    <div className={cn('inbound-proforma', proformaValidated && !inboundValidated ? 'validated' : undefined)}>
      <span>{t('projectMonth.proformaTitle')}</span>
      <ProformaForecast fullProjectMonth={projectMonth} />
      <span>{t(`project.proforma.${projectMonth.project.projectMonthConfig.proforma}`)}</span>
      <div className="inbound-actions">
        <ProjectMonthProformaStatusSelect
          value={projectMonth.details.inbound.proforma.status}
          onChange={status => saveInbound({
            ...inbound,
            proforma: {
              ...inbound.proforma!,
              status
            }
          })}
        />
        <div className="inbound-attachment-actions">
          <AttachmentUploadPreviewButtons
            isUploadDisabled={projectMonth.details.inbound.proforma.status !== 'new'}
            isPreviewDisabled={!hasProformaInvoiceBeenUploaded}
            uploadTooltip={t('projectMonth.proformaUpload')}
            previewTooltip={t('projectMonth.viewProformaInvoice', {fileName: proformaInvoiceDetails ? proformaInvoiceDetails.fileName : ''})}
            onUpload={f => {
              const isPartner = ['inboundWithTax', 'inboundWithoutTax'].includes(projectMonth.project.projectMonthConfig.proforma);
              const forecastType = isPartner ? 'partner' : 'client';
              const proformaFileName = `{month}-{${forecastType}}-{consultant}-Invoice-Proforma`
                .replace('{partner}', (projectMonth.partner?.name) || '')
                .replace('{client}', projectMonth.client.name)
                .replace('{consultant}', `${projectMonth.consultant.firstName} ${projectMonth.consultant.name}`)
                .replace('{month}', projectMonth.details.month.format('YYYY-MM'))
                + f.name.substring(f.name.lastIndexOf('.'));

              return dispatch(projectMonthUpload(f, ProformaInvoiceAttachmentType, projectMonth, proformaFileName) as any);
            }}
            downloadUrl={getProformaDownloadUrl()}
          />
        </div>
      </div>
    </div>
  );
};
