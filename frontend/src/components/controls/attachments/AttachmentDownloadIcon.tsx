import {useSelector} from 'react-redux';
import {Icon, IconProps} from '../Icon';
import {getInvoiceDownloadUrl} from '../../../actions/index';
import t from '../../../trans';
import {InvoiceModelProps} from '../../invoice/models/InvoiceModel';
import {Attachment, CoreInvoiceAttachments} from '../../../models';
import {getAwesomeFileType} from '../../invoice/models/getAwesomeFileType';
import {ConfacState} from '../../../reducers/app-state';
import {useProjectMonthFromInvoice} from '../../hooks/useProjects';

type InvoiceDownloadIconProps = InvoiceModelProps & {
  fileType: CoreInvoiceAttachments,
  style?: {}
}


export const InvoiceDownloadIcon = ({invoice, fileType, style, ...props}: InvoiceDownloadIconProps) => {
  const configInvoiceFileName = useSelector((state: ConfacState) => state.config.invoiceFileName);
  const defaultInvoiceFileName = invoice.client.invoiceFileName || configInvoiceFileName;

  const fullProjectMonth = useProjectMonthFromInvoice(invoice._id);
  const url = getInvoiceDownloadUrl(defaultInvoiceFileName, invoice, fileType, 'download', fullProjectMonth);
  return (
    <AttachmentDownloadIcon
      downloadUrl={url}
      attachment={invoice.attachments.find(a => a.type === fileType)}
      style={style}
      {...props}
    />
  );
};


export const InvoicePreviewIcon = ({ invoice, ...props }: InvoiceModelProps & IconProps) => {
  const configInvoiceFileName = useSelector((state: ConfacState) => state.config.invoiceFileName);
  const defaultInvoiceFileName = invoice.client.invoiceFileName || configInvoiceFileName;
  const fileType = invoice.isQuotation ? 'quotation' : 'invoice';

  const fullProjectMonth = useProjectMonthFromInvoice(invoice._id);
  const url = getInvoiceDownloadUrl(defaultInvoiceFileName, invoice, 'pdf', undefined, fullProjectMonth)
  return (
    <Icon
      title={t(`${fileType}.viewPdf`)}
      href={url}
      fa="far fa-eye"
      className="tst-view-invoice-pdf"
      {...props}
    />
  );
};


type AttachmentPreviewIconProps = {
  attachment: Attachment,
  previewUrl: string,
  title?: string,
}

export const AttachmentPreviewIcon = ({previewUrl, attachment, ...props}: AttachmentPreviewIconProps) => (
  <Icon title={t(props.title || 'invoice.viewPdf')} href={previewUrl} size={1} fa="far fa-eye" {...props} />
);


type AttachmentDownloadIconProps = IconProps & {
  attachment: Attachment | undefined,
  downloadUrl: string;
}

export const AttachmentDownloadIcon = ({downloadUrl, attachment, ...props}: AttachmentDownloadIconProps) => (
  <Icon
    fa={`${getAwesomeFileType(attachment)} fa-2x`}
    title={t('invoice.downloadAttachment', attachment && {type: attachment.desc || attachment.fileName || attachment.type})}
    {...props}
    href={downloadUrl}
    labelStyle={{fontSize: 16}}
    className="tst-download-attachment"
  />
);
