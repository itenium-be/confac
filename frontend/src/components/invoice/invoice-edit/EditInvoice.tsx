import {useEffect, useReducer, useState} from 'react';
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
import {EditInvoiceHeader} from './EditInvoiceHeader';
import {EditInvoiceBody} from './EditInvoiceBody';
import {EditInvoiceFooter} from './EditInvoiceFooter';
import {getNewInvoice} from '../models/getNewInvoice';


import './EditInvoice.scss';


const useInvoiceState = (isQuotation: boolean) => {
  const params = useParams();
  const config = useSelector((state: ConfacState) => state.config);
  const invoices = useSelector((state: ConfacState) => state.invoices);
  const clients = useSelector((state: ConfacState) => state.clients);

  const storeInvoice = useSelector((state: ConfacState) => state.invoices
    // eslint-disable-next-line
    .filter(x => x.isQuotation == isQuotation) // == the property is not present for some legacy data
    .find(x => x.number === parseInt(params.id, 10))
  );

  const newInvoice = getNewInvoice(config, invoices, clients, {isQuotation});
  const storeModelInvoice = new InvoiceModel(config, storeInvoice);
  const originalInvoice = storeInvoice ? storeModelInvoice : newInvoice;
  const [invoice, unpureSetInvoice] = useState<InvoiceModel>(originalInvoice);

  useEffect(() => {
    if (storeInvoice) {
      unpureSetInvoice(storeModelInvoice);
    } else {
      unpureSetInvoice(newInvoice);
    }
    // ATTN: We only depend on params.id & storeInvoice
    //       This is the only way the "form" invoice is
    //       overwritten.
  }, [params.id, storeInvoice]); // eslint-disable-line


  let docTitle: string;
  if (invoice?._id) {
    const name = t(isQuotation ? 'quotation.pdfName' : 'invoice.invoice');
    docTitle = `${name} #${invoice.number} for ${invoice.client?.name}`;
  } else {
    docTitle = t(isQuotation ? 'titles.quotationNew' : 'titles.invoiceNew');
  }
  useDocumentTitle(docTitle, 'already-translated');


  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const setInvoice = (invoiceModel: InvoiceModel) => {
    // InvoiceModel is a class, when mutating it remains the
    // same reference and React does not re-render.
    unpureSetInvoice(invoiceModel);
    forceUpdate();
  };

  return {
    invoice,
    setInvoice,
    originalInvoice,
  };
};


const EditInvoice = () => {
  const isQuotation = window.location.pathname.startsWith('/quotations/');
  const [showEmailModal, setEmailModal] = useState<EmailTemplate>(EmailTemplate.None);
  const {invoice, setInvoice, originalInvoice} = useInvoiceState(isQuotation);

  // ATTN: invoice updated from somewhere else will now overwrite local changes
  useEntityChangedToast(invoice?._id);

  return (
    <Container className="edit-container">
      <Form>
        <Row>
          <EditInvoiceHeader
            invoice={invoice}
            onChange={i => setInvoice(i)}
          />
        </Row>
        <EditInvoiceBody
          invoice={invoice}
          onChange={i => setInvoice(i)}
        />

        {!!invoice._id && invoice.client && showEmailModal !== EmailTemplate.None && (
          <EmailModal
            invoice={invoice}
            template={showEmailModal}
            onClose={() => setEmailModal(EmailTemplate.None)}
          />
        )}


        <StickyFooter>
          <EditInvoiceFooter
            invoice={invoice}
            initInvoice={originalInvoice}
            setEmailModal={setEmailModal}
          />
        </StickyFooter>
      </Form>
    </Container>
  );
};

export default EditInvoice;
