import {api, ApiError} from './utils/api-client';
import InvoiceModel from '../components/invoice/models/InvoiceModel';
import {EmailModel} from '../components/controls/email/EmailModels';
import {success, failure} from './appActions';
import {t} from '../components/utils';
import {ACTION_TYPES} from './utils/ActionTypes';
import {invoiceReplacements} from '../components/invoice/invoice-replacements';
import {AppDispatch} from '../types/redux';

type EmailAttachmentDetail = {
  type: string;
  fileName: string;
  fileType: string;
};

export function sendEmail(
  invoiceFileName: string,
  invoice: InvoiceModel,
  email: EmailModel,
  emailInvoiceOnly?: string,
) {
  return async (dispatch: AppDispatch) => {
    const attachmentDetails: EmailAttachmentDetail[] = email.attachments.map(attachmentType => {
      if (attachmentType === 'pdf') {
        return {
          type: 'pdf',
          fileName: `${invoiceReplacements(invoiceFileName, invoice)}.pdf`,
          fileType: 'application/pdf',
        };
      }

      const details = invoice.attachments.find(a => a.type === attachmentType);
      if (!details) {
        // Attachment is not uploaded but user could decide to send the email anyway
        return null;
      }

      return {
        type: attachmentType,
        fileName: details.fileName,
        fileType: details.fileType,
      };
    })
      .filter((att): att is EmailAttachmentDetail => att !== null);

    const emailPayload = {...email, attachments: attachmentDetails};

    let url = `/invoices/email/${invoice._id}`;
    if (emailInvoiceOnly && !invoice.lastEmail) {
      url += '?emailInvoiceOnly=' + encodeURIComponent(emailInvoiceOnly);
    }

    try {
      const res = await api.post<unknown>(url, emailPayload);
      console.log('Email response', res);
      success(t('email.sent'));
      dispatch({
        type: ACTION_TYPES.INVOICE_UPDATED,
        invoice: {
          ...invoice,
          lastEmail: res.text,
        },
      });
    } catch (err) {
      const error = err as ApiError;
      console.error('res ERROR', error);
      failure(error.body?.message, 'Email failure', 8000);
    }
  };
}
