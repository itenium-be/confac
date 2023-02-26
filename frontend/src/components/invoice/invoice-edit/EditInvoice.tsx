import React, {useReducer, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container, Row, Col, Form} from 'react-bootstrap';
import {t} from '../../utils';
import {EditInvoiceLines} from './invoice-lines/EditInvoiceLines';
import InvoiceNotVerifiedAlert from './InvoiceNotVerifiedAlert';
import {EditInvoiceSaveButtons} from './EditInvoiceSaveButtons';
import {createInvoice, previewInvoice, updateInvoiceRequest} from '../../../actions/index';
import {EditInvoiceClient} from './EditInvoiceClient';
import InvoiceModel from '../models/InvoiceModel';
import {ConfacState} from '../../../reducers/app-state';
import {EditInvoiceDetails} from './EditInvoiceDetails';
import {StickyFooter} from '../../controls/other/StickyFooter';
import {DownloadInvoiceButton} from './DownloadInvoiceButton';
import {EmailModal, EmailTemplate} from '../../controls/email/EmailModal';
import {Button} from '../../controls/form-controls/Button';
import {getNewInvoice} from '../models/getNewInvoice';
import {useDocumentTitle} from '../../hooks/useDocumentTitle';
import {InvoiceAttachmentsForm} from '../controls/InvoiceAttachmentsForm';
import {EditInvoiceBadges} from './EditInvoiceBadges';
import {Audit} from '../../admin/audit/Audit';
import {NotesModalButton} from '../../controls/form-controls/button/NotesModalButton';
import {Claim} from '../../users/models/UserModel';
import {useProjectsMonth} from '../../hooks/useProjects';
import {useParams} from 'react-router-dom';
import {ProjectMonthOrManualSelect} from '../../project/controls/ProjectMonthOrManualSelect';


import './EditInvoice.scss';


const EditInvoice = () => {
  const isQuotation = window.location.pathname.startsWith('/quotations/');

  const params = useParams();
  const config = useSelector((state: ConfacState) => state.config);
  const storeInvoice = useSelector((state: ConfacState) => state.invoices
    // eslint-disable-next-line
    .filter(x => x.isQuotation == isQuotation) // == the property is not present for some legacy data
    .find(x => x.number === parseInt(params.id, 10))
  );
  const invoices = useSelector((state: ConfacState) => state.invoices);
  const clients = useSelector((state: ConfacState) => state.clients);
  const initInvoice = storeInvoice ? new InvoiceModel(config, storeInvoice) : getNewInvoice(config, invoices, clients, {isQuotation});
  const fullProjectMonth = useProjectsMonth(storeInvoice?.projectMonth?.projectMonthId);
  const [invoice, setInvoice] = useState<InvoiceModel>(initInvoice);
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const dispatch = useDispatch();
  // useEffect(() => window.scrollTo(0, 0)); // TODO: each keystroke made it scroll to top :(
  const [showEmailModal, setEmailModal] = useState<EmailTemplate>(EmailTemplate.None);

  let docTitle: string;
  if (storeInvoice?._id) {
    const name = t(isQuotation ? 'quotation.pdfName' : 'invoice.invoice');
    docTitle = `${name} #${invoice.number} for ${invoice.client?.name}`;
  } else {
    docTitle = t(isQuotation ? 'titles.quotationNew' : 'titles.invoiceNew');
  }
  useDocumentTitle(docTitle, 'already-translated');

  if (storeInvoice && !invoice._id) {
    setInvoice(new InvoiceModel(config, storeInvoice));
  }

  const type: 'quotation' | 'invoice' = isQuotation ? 'quotation' : 'invoice';

  const updateInvoice = (key: string, value: any, calcMoneys = false) => {
    // Naughty naughty: We are manipulating state directly!
    // To fix this: state should be a regular object, and a
    // InvoiceModel should be created in the render
    invoice.updateField(key, value, calcMoneys);
    setInvoice(invoice);
    forceUpdate();
  }

  // TODO: confusion with storeInvoice vs initInvoice vs invoice
  // --> There should be a form variant and a model variant new'd for every render
  // --> problem right now is that ex for a new invoice the invoice._id is not set after save
  // --> the invoice.attachments are also not updated because they are separate from the form...

  return (
    <Container className="edit-container">
      <Form>
        <Row>
          <Col sm={12} style={{marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{display: 'inline-flex', alignItems: 'flex-start'}}>
              <h1 style={{width: 'unset'}}>
                {initInvoice._id ? t(`${type}.editTitle`) : t(`${type}.createTitle`)}
                <Audit model={storeInvoice} modelType="invoice" />
              </h1>
              <div>
                <EditInvoiceBadges invoice={invoice} />
              </div>
            </div>
            <div>
              <div className={`invoice-top-buttonbar ${storeInvoice?._id ? 'invoice-edit' : 'invoice-new'}`}>
                <NotesModalButton
                  claim={invoice.isQuotation ? Claim.ManageQuotations : Claim.ManageInvoices}
                  value={invoice.note}
                  onChange={val => updateInvoice('note', val)}
                  title={t('projectMonth.note')}
                  variant="link"
                />
                {initInvoice._id && <DownloadInvoiceButton invoice={initInvoice} />}
              </div>
            </div>
          </Col>
          <Col sm={12}>
            <InvoiceNotVerifiedAlert invoice={initInvoice} />
          </Col>
        </Row>

        <Row>
          <Col sm={6}>
            <EditInvoiceClient
              invoice={invoice}
              onChange={val => {
                setInvoice(invoice.setClient(val))
                forceUpdate();
              }}
            />
          </Col>

          <Col sm={6}>
            <Row>
              <EditInvoiceDetails
                invoice={invoice}
                onChange={(fieldName: string, value: any) => updateInvoice(fieldName, value, true)}
              />
            </Row>
            <Row>
              <ProjectMonthOrManualSelect
                value={invoice.projectMonth}
                onProjectMonthChange={fpm => {
                  invoice.setProjectMonth(fpm);
                  setInvoice(invoice);
                  forceUpdate();
                }}
                onManualChange={(consultant, month) => {
                  invoice.setManualProjectMonth(consultant, month || undefined);
                  setInvoice(invoice);
                  forceUpdate();
                }}
                invoice={invoice}
              />
            </Row>
          </Col>
        </Row>

        {!!initInvoice._id && invoice.client && showEmailModal !== EmailTemplate.None && (
          <EmailModal
            invoice={initInvoice}
            template={showEmailModal}
            onClose={() => setEmailModal(EmailTemplate.None)}
          />
        )}

        <Row style={{marginTop: 8}}>
          <EditInvoiceLines
            claim={invoice.isQuotation ? Claim.ManageQuotations : Claim.ManageInvoices}
            value={invoice.lines}
            onChange={m => {
              setInvoice(invoice.setLines(m));
              forceUpdate();
            }}
            translationPrefix={invoice.getType()}
          />
        </Row>
        <InvoiceAttachmentsForm model={initInvoice} />
        <StickyFooter>
          {!initInvoice.isNew && (
            <>
              <Button
                claim={invoice.isQuotation ? Claim.ManageQuotations : Claim.EmailInvoices}
                variant={storeInvoice?.verified || storeInvoice?.lastEmail ? 'outline-danger' : 'light'}
                icon="far fa-envelope"
                onClick={() => setEmailModal(EmailTemplate.InitialEmail)}
              >
                {t('email.prepareEmail')}
              </Button>
              <Button
                claim={invoice.isQuotation ? Claim.ManageQuotations : Claim.EmailInvoices}
                variant={storeInvoice?.verified || !storeInvoice?.lastEmail ? 'outline-danger' : 'light'}
                icon="far fa-envelope"
                onClick={() => setEmailModal(EmailTemplate.Reminder)}
              >
                {t('email.prepareEmailReminder')}
              </Button>
            </>
          )}
          <EditInvoiceSaveButtons
            onClick={(type, navigate) => {
              if (type === 'create') {
                dispatch(createInvoice(invoice, navigate) as any);
              } if (type === 'preview') {
                dispatch(previewInvoice(invoice.client.invoiceFileName || config.invoiceFileName, invoice, fullProjectMonth) as any);
              } if (type === 'update') {
                dispatch(updateInvoiceRequest(invoice, undefined, false, navigate) as any);
              }
            }}
            invoice={initInvoice}
          />
        </StickyFooter>
      </Form>
    </Container>
  );
}

export default EditInvoice;
