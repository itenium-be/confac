import request from 'superagent-bluebird-promise';
import InvoiceModel from '../components/invoice/models/InvoiceModel';
import {EmailModel} from '../components/controls/email/EmailModels';
import {buildUrl} from './utils/buildUrl';
import {success, failure} from './appActions';
import {t} from '../components/utils';
import {ACTION_TYPES} from './utils/ActionTypes';
import {invoiceReplacements} from '../components/invoice/invoice-replacements';
import {authService} from '../components/users/authService';


export function sendEmail(
  invoiceFileName: string,
  invoice: InvoiceModel,
  email: EmailModel,
  emailInvoiceOnly?: string,
) {

  return dispatch => {
    // eslint-disable-next-line no-param-reassign
    email.attachments = email.attachments.map(attachmentType => {
      if (attachmentType === 'pdf') {
        return {
          type: 'pdf',
          fileName: `${invoiceReplacements(invoiceFileName, invoice)}.pdf`,
          fileType: 'application/pdf',
        };
      } else if (attachmentType === 'xml') {
        return {
          type: 'xml',
          fileName: `${invoiceReplacements(invoiceFileName, invoice)}.xml`,
          fileType: 'application/xml',
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
      } as any;
    })
      .filter(att => att);

    let url = buildUrl(`/invoices/email/${invoice._id}`);
    if (emailInvoiceOnly && !invoice.lastEmail) {
      url += '?emailInvoiceOnly=' + encodeURIComponent(emailInvoiceOnly);
    }
    request.post(url)
      .set('Authorization', authService.getBearer())
      .send(email)
      .then(res => {
        console.log('Email response', res); // eslint-disable-line
        success(t('email.sent'));
        dispatch({
          type: ACTION_TYPES.INVOICE_EMAILED,
          payload: {
            _id: invoice._id,
            lastEmail: res.text,
          },
        });
      })
      .catch(err => {
        console.error('res ERROR', err); // eslint-disable-line
        failure(err.body?.message, 'Email failure', 8000);
      });
  };
}
