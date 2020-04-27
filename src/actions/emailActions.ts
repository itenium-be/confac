import request from 'superagent-bluebird-promise';
import InvoiceModel from '../components/invoice/models/InvoiceModel';
import {EmailModel} from '../components/controls/email/EmailModels';
import {buildUrl} from './utils/buildUrl';
import {success, failure} from './appActions';
import {t} from '../components/utils';
import {ACTION_TYPES} from './utils/ActionTypes';
import {invoiceReplacements} from '../components/invoice/invoice-replacements';
import {FullProjectMonthModel} from '../components/project/models/FullProjectMonthModel';


export function sendEmail(invoice: InvoiceModel, email: EmailModel, fullProjectMonth?: FullProjectMonthModel) {
  return dispatch => {
    // eslint-disable-next-line no-param-reassign
    email.attachments = email.attachments.map(attachmentType => {
      if (attachmentType === 'pdf') {
        return {
          type: 'pdf',
          fileName: `${invoiceReplacements(invoice.fileName, invoice, fullProjectMonth)}.pdf`,
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
      } as any;
    })
      .filter(att => att);

    request.post(buildUrl(`/invoices/email/${invoice._id}`))
      .send(email)
      .then(res => {
        console.log('res', res); // eslint-disable-line
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
        failure(err.body.message, 'Email failure', 8000);
      });
  };
}
