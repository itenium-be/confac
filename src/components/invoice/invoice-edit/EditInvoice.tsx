import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Row, Col, Form, Badge} from 'react-bootstrap';
import {t, formatDate} from '../../utils';
import EditInvoiceLines from './invoice-lines/EditInvoiceLines';
import InvoiceNotVerifiedAlert from './InvoiceNotVerifiedAlert';
import {EditInvoiceSaveButtons} from './EditInvoiceSaveButtons';
import {invoiceAction} from '../../../actions/index';
import {EditInvoiceClient} from './EditInvoiceClient';
import {EditInvoiceExtraFields} from './EditInvoiceExtraFields';
import InvoiceModel from '../models/InvoiceModel';
import {ConfigModel} from '../../config/models/ConfigModel';
import {ClientModel} from '../../client/models/ClientModels';
import {ConfacState} from '../../../reducers/app-state';
import {EditInvoiceDetails} from './EditInvoiceDetails';
import {StickyFooter} from '../../controls/skeleton/StickyFooter';
import {DownloadInvoiceButton} from './DownloadInvoiceButton';
import {EmailModal, EmailModalTitle} from '../../controls/email/EmailModal';
import {EmailModel} from '../../controls/email/EmailModels';
import {sendEmail} from '../../../actions/emailActions';
import {invoiceReplacements} from '../../../actions/utils/download-helpers';
import {StringInput} from '../../controls/form-controls/inputs/StringInput';
import {Button} from '../../controls/form-controls/Button';
import {getNewInvoice} from '../models/getNewInvoice';
import {getDocumentTitle} from '../../hooks/useDocumentTitle';
import {InvoiceAttachmentsForm} from '../controls/InvoiceAttachmentsForm';
import {ConsultantModel} from '../../consultant/models/ConsultantModel';
import {projectMonthResolve} from '../../project/ProjectMonthsLists';
import {FullProjectMonthModel} from '../../project/models/ProjectMonthModel';
import {ConsultantSelect} from '../../consultant/controls/ConsultantSelect';


type EditInvoiceProps = {
  invoices: InvoiceModel[],
  config: ConfigModel,
  app: { isLoaded: boolean },
  clients: ClientModel[],
  consultants: ConsultantModel[],
  fullProjectsMonth: FullProjectMonthModel[],
  invoiceAction: Function,
  match: {
    params: {
      id: string
    }
  },
  renavigationKey: string,
  sendEmail: (invoice: InvoiceModel, email: EmailModel) => void,
}

type EditInvoiceState = {
  invoice: InvoiceModel,
  showExtraFields: boolean,
  renavigationKey: string,
  showEmailModal: boolean,
}

const EditInvoiceBadge = ({label}:{label: string}) => (
  <Badge style={{marginLeft: 10, fontSize: '100%', fontWeight: 300}} variant="secondary">{label}</Badge>
);

export class EditInvoice extends Component<EditInvoiceProps, EditInvoiceState> {
  constructor(props: EditInvoiceProps) {
    super(props);
    this.state = {
      invoice: this.createModel(props),
      showExtraFields: false,
      renavigationKey: '',
      showEmailModal: false,
    };
  }

  componentDidMount() {
    // TODO: When converting this to a functional component, also update the title:
    // "#Nr clientName (consultantName) YYYY-MM" (YYYY-MM of projectMonth.date)
    const name = t(this.isQuotation ? 'quotation.pdfName' : 'invoice.invoice');
    document.title = getDocumentTitle(`${name} #${this.state.invoice.number}`);
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

  getConsultantName(invoice: InvoiceModel): string {
    const consultant = this.props.consultants.find(c => c._id === invoice.consultantId);
    if (!consultant) return '';

    return `${t(`consultant.types.${consultant.type}`)} ${consultant.firstName} ${consultant.name}`;
  }

  getProjectPartnerClientName(invoice: InvoiceModel): string {
    const fullProjectMonth = this.props.fullProjectsMonth.find(fpm => fpm._id === invoice.projectMonthId);
    if (!fullProjectMonth) return '';
    const {client, partner} = fullProjectMonth;

    return `${partner ? `${partner.name} / ` : ''}${client.name}`;
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

    const getDefaultEmailValue = (i: InvoiceModel, config: ConfigModel): EmailModel => {
      const defaultEmail = config.email;
      if (!i.client || !i.client.email) {
        return defaultEmail;
      }

      const emailValues = Object.keys(i.client.email).reduce((acc: EmailModel, cur: string) => {
        if (i.client.email[cur]) {
          acc[cur] = i.client.email[cur];
          return acc;
        }
        return acc;
      }, {} as EmailModel);

      const finalValues = {...defaultEmail, ...emailValues};
      finalValues.subject = invoiceReplacements(finalValues.subject, i);
      if (i.lastEmail && config.emailReminder) {
        finalValues.body = config.emailReminder;
      }
      finalValues.body = invoiceReplacements(finalValues.body, i);
      finalValues.body += config.emailSignature;

      return finalValues;
    };

    return (
      <Container className="edit-container">
        <Form>
          <Row>
            <Col sm={12} style={{marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div style={{display: 'flex', alignItems: 'flex-start'}}>
                <h1>
                  {invoice._id ? (
                    <>
                      {t(`${this.type}.editTitle`)}
                      <small className="created-on">
                        {`${t('createdOn')} ${formatDate(invoice.createdOn)}`}
                      </small>
                    </>
                  ) : t(`${this.type}.createTitle`)}
                </h1>
                {invoice.consultantId && <EditInvoiceBadge label={this.getConsultantName(invoice)} />}
                {invoice.projectMonthId && <EditInvoiceBadge label={this.getProjectPartnerClientName(invoice)} />}
              </div>
              <div>
                {invoice._id && <DownloadInvoiceButton invoice={invoice} />}
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
                  onChange={(fieldName: string, value: any) => this.updateInvoice(fieldName, value)}
                />
              </Row>
              <Row>
                <Col sm={12}>
                  <StringInput
                    label={t('invoice.discount')}
                    placeholder={t('invoice.discountPlaceholder')}
                    value={invoice.discount}
                    onChange={value => this.updateInvoice('discount', value, true)}
                    data-tst="invoice.discount"
                  />
                </Col>
                <Col>
                  <ConsultantSelect
                    label={t('project.consultant')}
                    value={invoice.consultantId ? invoice.consultantId : ''}
                    onChange={consultantId => this.updateInvoice('consultantId', consultantId)}
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          {!invoice.isNew && invoice.client && this.state.showEmailModal && (
            <EmailModal
              show={this.state.showEmailModal}
              defaultValue={getDefaultEmailValue(invoice, this.props.config)}
              attachmentsAvailable={invoice.attachments.map(a => a.type)}
              title={<EmailModalTitle title={t('email.title')} lastEmail={invoice.lastEmail} />}
              onClose={() => this.setState({showEmailModal: false})}
              onConfirm={(email: EmailModel) => this.props.sendEmail(invoice, email)}
            />
          )}

          <EditInvoiceExtraFields
            forceOpen={this.state.showExtraFields}
            invoice={invoice}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={this.updateInvoice.bind(this, 'extraFields')}
          />

          <Row style={{marginTop: 8}}>
            <EditInvoiceLines
              invoice={invoice}
              onChange={m => this.setState({invoice: m})}
            />
          </Row>
          <InvoiceAttachmentsForm model={invoice} />
          <StickyFooter>
            {!invoice.isNew && (
              <Button
                variant={invoice.verified ? 'outline-danger' : 'light'}
                icon="far fa-envelope"
                onClick={() => this.setState({showEmailModal: true})}
              >
                {t(!invoice.lastEmail ? 'email.prepareEmail' : 'email.prepareEmailReminder')}
              </Button>
            )}
            <EditInvoiceSaveButtons onClick={(type, history) => this.props.invoiceAction(invoice, type, history)} invoice={invoice} />
          </StickyFooter>
        </Form>
      </Container>
    );
  }
}

function mapStateToProps(state: ConfacState, props: any) {
  const fullProjectsMonth = state.projectsMonth.map(pm => projectMonthResolve(pm, state));

  return {
    config: state.config,
    app: state.app,
    clients: state.clients,
    invoices: state.invoices,
    renavigationKey: props.location.key,
    consultants: state.consultants,
    fullProjectsMonth,
  };
}

export default connect(mapStateToProps, {invoiceAction, sendEmail})(EditInvoice);
