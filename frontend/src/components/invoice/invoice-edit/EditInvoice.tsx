import {useEffect, useReducer, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {Container, Row, Form} from 'react-bootstrap';
import {t} from '../../utils';
import InvoiceModel from '../models/InvoiceModel';
import {ConfacState} from '../../../reducers/app-state';
import {StickyFooter} from '../../controls/other/StickyFooter';
import {EmailModal, EmailTemplate} from '../../controls/email/EmailModal';
import {useDocumentTitle} from '../../hooks/useDocumentTitle';
import {useParams} from 'react-router-dom';
import useEntityChangedToast from '../../hooks/useEntityChangedToast';


import './EditInvoice.scss';
import { EditInvoiceHeader } from './EditInvoiceHeader';
import { EditInvoiceBody } from './EditInvoiceBody';
import { EditInvoiceFooter } from './EditInvoiceFooter';
import { getNewInvoice } from '../models/getNewInvoice';


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

  const [invoice, setInvoice] = useState<InvoiceModel>(initInvoice);
  useEntityChangedToast(invoice._id);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

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

  const configRef = useRef(config)
  const invoicesRef = useRef(invoices)
  useEffect(() => {
    const isQuotation = window.location.pathname.startsWith('/quotations/');
    window.scrollTo(0, 0)

    const navigateInvoice = invoicesRef.current.filter(x => x.isQuotation && isQuotation).find(x => x.number === parseInt(params.id, 10))
    setInvoice(new InvoiceModel(configRef.current, navigateInvoice))
  }, [params])


  // TODO: confusion with storeInvoice vs initInvoice vs invoice
  // --> There should be a form variant and a model variant new'd for every render
  // --> problem right now is that ex for a new invoice the invoice._id is not set after save
  // --> the invoice.attachments are also not updated because they are separate from the form...


  return (
    <Container className="edit-container">
      <Form>
        <Row>
          <EditInvoiceHeader
            invoice={invoice}
            isNew={!initInvoice._id}
            onChange={invoice => {
              setInvoice(invoice)
              forceUpdate()
            }}
          />
        </Row>
        <Row>
          <EditInvoiceBody
            invoice={invoice}
            onChange={invoice => {
              setInvoice(invoice)
              forceUpdate()
            }}
          />
        </Row>

        {!!initInvoice._id && invoice.client && showEmailModal !== EmailTemplate.None && (
          <EmailModal
            invoice={initInvoice}
            template={showEmailModal}
            onClose={() => setEmailModal(EmailTemplate.None)}
          />
        )}


        <StickyFooter>
          <EditInvoiceFooter
            invoice={invoice}
            initInvoice={initInvoice}
            setEmailModal={setEmailModal}
          />
        </StickyFooter>
      </Form>
    </Container>
  );
}

export default EditInvoice;
