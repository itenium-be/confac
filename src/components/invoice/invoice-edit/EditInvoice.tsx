import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Row, Col, Form} from 'react-bootstrap';
import {t} from '../../utils';
import {EditInvoiceLines} from './invoice-lines/EditInvoiceLines';
import InvoiceNotVerifiedAlert from './InvoiceNotVerifiedAlert';
import {EditInvoiceSaveButtons} from './EditInvoiceSaveButtons';
import {createInvoice, previewInvoice, updateInvoiceRequest} from '../../../actions/index';
import {EditInvoiceClient} from './EditInvoiceClient';
import InvoiceModel from '../models/InvoiceModel';
import {ConfigModel} from '../../config/models/ConfigModel';
import {ClientModel} from '../../client/models/ClientModels';
import {ConfacState} from '../../../reducers/app-state';
import {EditInvoiceDetails} from './EditInvoiceDetails';
import {StickyFooter} from '../../controls/skeleton/StickyFooter';
import {DownloadInvoiceButton} from './DownloadInvoiceButton';
import {EmailModal, EmailTemplate} from '../../controls/email/EmailModal';
import {EmailModel} from '../../controls/email/EmailModels';
import {Button} from '../../controls/form-controls/Button';
import {getNewInvoice} from '../models/getNewInvoice';
import {getDocumentTitle} from '../../hooks/useDocumentTitle';
import {InvoiceAttachmentsForm} from '../controls/InvoiceAttachmentsForm';
import {ConsultantModel} from '../../consultant/models/ConsultantModel';
import {projectMonthResolve} from '../../project/ProjectMonthsLists';
import {FullProjectMonthModel} from '../../project/models/FullProjectMonthModel';
import {ProjectMonthSelect} from '../../project/controls/ProjectMonthSelect';
import {EditInvoiceBadges} from './EditInvoiceBadges';
import {Audit} from '../../admin/Audit';
import {NotesModalButton} from '../../controls/form-controls/button/NotesModalButton';


import './EditInvoice.scss';


type EditInvoiceProps = {
  invoices: InvoiceModel[],
  config: ConfigModel,
  app: { isLoaded: boolean },
  clients: ClientModel[],
  consultants: ConsultantModel[],
  fullProjectMonths: FullProjectMonthModel[],
  createInvoice: Function,
  previewInvoice: Function,
  updateInvoiceRequest: Function,
  match: {
    params: {
      id: string
    }
  },
  renavigationKey: string,
  sendEmail: (invoice: InvoiceModel, email: EmailModel, fullProjectMonth?: FullProjectMonthModel) => void,
}

type EditInvoiceState = {
  invoice: InvoiceModel,
  renavigationKey: string,
  showEmailModal: EmailTemplate,
}


export class EditInvoice extends Component<EditInvoiceProps, EditInvoiceState> {
  constructor(props: EditInvoiceProps) {
    super(props);
    this.state = {
      invoice: this.createModel(props),
      renavigationKey: '',
      showEmailModal: EmailTemplate.None,
    };
  }

  componentDidMount() {
    // TODO: When converting this to a functional component, also update the title:
    // "#Nr clientName (consultantName) YYYY-MM" (YYYY-MM of projectMonth.date)
    let docTitle: string;
    if (this.state.invoice._id) {
      const name = t(this.isQuotation ? 'quotation.pdfName' : 'invoice.invoice');
      docTitle = `${name} #${this.state.invoice.number}`;
    } else {
      docTitle = t(this.isQuotation ? 'titles.quotationNew' : 'titles.invoiceNew');
    }
    document.title = getDocumentTitle(docTitle);
    window.scrollTo(0, 0);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: EditInvoiceProps) {
    if (nextProps.app.isLoaded !== this.props.app.isLoaded
      || (nextProps.match.params.id !== this.props.match.params.id)
      || nextProps.invoices !== this.props.invoices // Changing this? Check confac-back::invoices.js
      || nextProps.renavigationKey !== this.state.renavigationKey) {

      this.setState({invoice: this.createModel(nextProps), renavigationKey: nextProps.renavigationKey});
    }
  }

  get isQuotation(): boolean {
    return window.location.pathname.startsWith('/quotations/');
  }

  get type(): 'quotation' | 'invoice' {
    return this.isQuotation ? 'quotation' : 'invoice';
  }

  createModel(props: EditInvoiceProps): InvoiceModel {
    if (props.match.params.id) {
      // Existing invoice / quotation
      const invoicesOrQuotations = this.isQuotation
        ? props.invoices.filter(x => x.isQuotation)
        : props.invoices.filter(x => !x.isQuotation);

      const invoice = invoicesOrQuotations.find(i => i.number === parseInt(props.match.params.id, 10));
      return new InvoiceModel(props.config, invoice);
    }

    const invoice = {
      isQuotation: this.isQuotation,
    };

    return getNewInvoice(props.config, props.invoices, props.clients, invoice);
  }

  updateInvoice(key: string, value: any, calcMoneys = false) {
    // Naughty naughty: We are manipulating state directly!
    // To fix this: state should be a regular object, and a
    // InvoiceModel should be created in the render
    this.state.invoice.updateField(key, value, calcMoneys);
    this.forceUpdate();
  }

  render() {
    const {invoice} = this.state;
    const fullProjectMonth = this.props.fullProjectMonths.find(x => x.invoice && x.invoice._id === invoice._id);
    return (
      <Container className="edit-container">
        <Form>
          <Row>
            <Col sm={12} style={{marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div style={{display: 'inline-flex', alignItems: 'flex-start'}}>
                <h1 style={{width: 'unset'}}>
                  {invoice._id ? t(`${this.type}.editTitle`) : t(`${this.type}.createTitle`)}
                  <Audit audit={invoice.audit} />
                </h1>
                <div>
                  <EditInvoiceBadges invoice={invoice} />
                </div>
              </div>
              <div>
                <div className={`invoice-top-buttonbar ${invoice._id ? 'invoice-edit' : 'invoice-new'}`}>
                  <NotesModalButton
                    value={invoice.note}
                    onChange={val => this.updateInvoice('note', val)}
                    title={t('projectMonth.note')}
                    variant="link"
                  />
                  {invoice._id && <DownloadInvoiceButton invoice={invoice} />}
                </div>
              </div>
            </Col>
            <Col sm={12}>
              <InvoiceNotVerifiedAlert invoice={invoice} />
            </Col>
          </Row>

          <Row>
            <Col sm={6}>
              <EditInvoiceClient
                invoice={invoice}
                onChange={val => this.setState({invoice: invoice.setClient(val)})}
              />
            </Col>

            <Col sm={6}>
              <Row>
                <EditInvoiceDetails
                  invoice={invoice}
                  onChange={(fieldName: string, value: any) => this.updateInvoice(fieldName, value, true)}
                />
              </Row>
              <Row>
                <Col sm={12}>
                  <ProjectMonthSelect
                    label={t('projectMonth.selectLabel')}
                    value={invoice.projectMonth ? invoice.projectMonth.projectMonthId : ''}
                    onChange={fpm => {
                      this.state.invoice.setProjectMonth(fpm);
                      this.forceUpdate();
                    }}
                    invoice={invoice}
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          {!invoice.isNew && invoice.client && this.state.showEmailModal !== EmailTemplate.None && (
            <EmailModal
              invoice={invoice}
              template={this.state.showEmailModal}
              onClose={() => this.setState({showEmailModal: EmailTemplate.None})}
            />
          )}

          <Row style={{marginTop: 8}}>
            <EditInvoiceLines
              value={invoice.lines}
              onChange={m => this.setState({invoice: invoice.setLines(m)})}
              translationPrefix={invoice.getType()}
            />
          </Row>
          <InvoiceAttachmentsForm model={invoice} />
          <StickyFooter>
            {!invoice.isNew && (
              <>
                <Button
                  variant={invoice.verified || invoice.lastEmail ? 'outline-danger' : 'light'}
                  icon="far fa-envelope"
                  onClick={() => this.setState({showEmailModal: EmailTemplate.InitialEmail})}
                >
                  {t('email.prepareEmail')}
                </Button>
                <Button
                  variant={invoice.verified || !invoice.lastEmail ? 'outline-danger' : 'light'}
                  icon="far fa-envelope"
                  onClick={() => this.setState({showEmailModal: EmailTemplate.Reminder})}
                >
                  {t('email.prepareEmailReminder')}
                </Button>
              </>
            )}
            <EditInvoiceSaveButtons
              onClick={(type, history) => {
                if (type === 'create') {
                  this.props.createInvoice(invoice, history);
                } if (type === 'preview') {
                  this.props.previewInvoice(invoice.client.invoiceFileName || this.props.config.invoiceFileName, invoice, fullProjectMonth);
                } if (type === 'update') {
                  this.props.updateInvoiceRequest(invoice, undefined, false, history);
                }
              }}
              invoice={invoice}
            />
          </StickyFooter>
        </Form>
      </Container>
    );
  }
}

function mapStateToProps(state: ConfacState, props: any) {
  // TODO: need a selector for this stuff, this is going to be a performance issue
  const fullProjectMonths = state.projectsMonth.map(pm => projectMonthResolve(pm, state));

  return {
    config: state.config,
    app: state.app,
    clients: state.clients,
    invoices: state.invoices,
    renavigationKey: props.location.key,
    consultants: state.consultants,
    fullProjectMonths,
  };
}

export default connect(mapStateToProps, {createInvoice, previewInvoice, updateInvoiceRequest})(EditInvoice);
