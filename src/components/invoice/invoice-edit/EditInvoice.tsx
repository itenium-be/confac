import React, {Component} from 'react';
import {connect} from 'react-redux';
import {t, EditInvoiceViewModel} from '../../util';
import moment from 'moment';
import * as Control from '../../controls';
import {Container, Row, Col, Form} from 'react-bootstrap';
import EditInvoiceLines from './invoice-lines/EditInvoiceLines';
import InvoiceNotVerifiedAlert from './InvoiceNotVerifiedAlert';
import {EditInvoiceSaveButtons} from './EditInvoiceSaveButtons';
import {invoiceAction, invoiceReplacements} from '../../../actions/index';
import {EditInvoiceClient} from './EditInvoiceClient';
import {EditInvoiceExtraFields} from './EditInvoiceExtraFields';
import InvoiceModel from '../models/InvoiceModel';
import { ConfigModel } from '../../config/models/ConfigModel';
import { ClientModel } from '../../client/models/ClientModels';
import { ConfacState } from '../../../reducers/app-state';
import { EditInvoiceDetails } from './EditInvoiceDetails';
import { StickyFooter } from '../../controls/skeleton/StickyFooter';
import { DownloadInvoiceButton } from './DownloadInvoiceButton';
import { Button } from '../../controls';
import { EmailModal, EmailModalTitle } from '../../controls/email/EmailModal';
import { EmailModel } from '../../controls/email/EmailModels';
import { sendEmail } from '../../../actions/emailActions';


type EditInvoiceProps = {
  invoices: InvoiceModel[],
  config: ConfigModel,
  app: {isLoaded: boolean},
  clients: ClientModel[],
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

export class EditInvoice extends Component<EditInvoiceProps, EditInvoiceState> {
  get isQuotation(): boolean {
    return window.location.pathname.startsWith('/quotations/');
  }

  get type(): 'quotation' | 'invoice' {
    return this.isQuotation ? 'quotation' : 'invoice';
  }

  constructor(props: EditInvoiceProps) {
    super(props);
    this.state = {
      invoice: this.createModel(props),
      showExtraFields: false,
      renavigationKey: '',
      showEmailModal: false,
    };
  }

  createModel(props: EditInvoiceProps): EditInvoiceViewModel {
    const invoicesOrQuotations = this.isQuotation ? props.invoices.filter(x => x.isQuotation) : props.invoices.filter(x => !x.isQuotation);
    if (props.match.params.id) {
      // Existing invoice / quotation
      const invoice = invoicesOrQuotations.find(i => i.number === parseInt(props.match.params.id, 10));
      return new EditInvoiceViewModel(props.config, invoice);

    } else {
      // New invoice / quotation
      var client: undefined | ClientModel;
      if (props.config.defaultClient) {
        client = props.clients.find(c => c._id === props.config.defaultClient);
      }
      var model = EditInvoiceViewModel.createNew(props.config, client);

      model.number = invoicesOrQuotations.map(i => i.number).reduce((a, b) => Math.max(a, b), 0) + 1;
      model.isQuotation = this.isQuotation;
      return model;
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  UNSAFE_componentWillReceiveProps(nextProps: EditInvoiceProps) {
    if (nextProps.app.isLoaded !== this.props.app.isLoaded
      || (nextProps.match.params.id !== this.props.match.params.id)
      || nextProps.invoices !== this.props.invoices // Changing this? Check confac-back::invoices.js
      || nextProps.renavigationKey !== this.state.renavigationKey) {

      this.setState({invoice: this.createModel(nextProps), renavigationKey: nextProps.renavigationKey});
    }
  }

  updateInvoice(key: string, value: any, calcMoneys = false) {
    // Naughty naughty: We are manipulating state directly!
    // To fix this: state should be a regular object, and a
    // EditInvoiceViewModel should be created in the render
    this.state.invoice.updateField(key, value, calcMoneys);
    this.forceUpdate();
  }

  render() {
    const {invoice} = this.state;
    const extraFieldsVisible = invoice.extraFields.length === 0 && !this.state.showExtraFields;

    const getDefaultEmailValue = (invoice: InvoiceModel, defaultEmail: EmailModel): EmailModel => {
      if (!invoice.client || !invoice.client.email) {
        return defaultEmail;
      }

      const emailValues = Object.keys(invoice.client.email).reduce((acc: EmailModel, cur: string) => {
        if (invoice.client.email[cur]) {
          acc[cur] = invoice.client.email[cur];
          return acc;
        }
        return acc;
      }, {} as EmailModel);

      const finalValues = Object.assign({}, defaultEmail, emailValues);
      finalValues.subject = invoiceReplacements(finalValues.subject, invoice);
      finalValues.body = invoiceReplacements(finalValues.body, invoice);

      return finalValues;
    }

    return (
      <Container className="edit-container">
        <Form>
          <Row>
            <Col sm={12}>
              <h1>
                {invoice._id && (
                  <div style={{float: 'right'}}>
                    <DownloadInvoiceButton invoice={invoice} />
                  </div>)
                }
                {invoice._id ? t(this.type + '.editTitle') : t(this.type + '.createTitle')}
                {invoice.createdOn && <small className="created-on">{t('createdOn')} {moment(invoice.createdOn).format('DD/MM/YYYY')}</small>}
              </h1>
            </Col>

            <Col sm={12}>
              <InvoiceNotVerifiedAlert invoice={invoice} />
            </Col>
          </Row>

          <Row>
            <Col sm={6}>
              <EditInvoiceClient
                invoice={invoice}
                onChange={val => this.setState(val)}
              />
            </Col>

            <Col sm={6}>
              <Row>
                <EditInvoiceDetails
                  invoice={invoice}
                  onChange={(fieldName: string, value: any) => this.updateInvoice(fieldName, value)}
                />

                {extraFieldsVisible ? (
                  <Col sm={12}>
                    <Control.ExpandIcon
                      center
                      color="#D3D3D3"
                      title={t('config.extraFields.open')}
                      onClick={() => this.setState({showExtraFields: !this.state.showExtraFields})}
                      data-tst="extra-fields-open"
                    />
                  </Col>
                ) : (
                  <Col sm={12}>
                    <Control.StringInput
                      label={t('invoice.discount')}
                      placeholder={t('invoice.discountPlaceholder')}
                      value={invoice.discount}
                      onChange={value => this.updateInvoice('discount', value, true)}
                      data-tst="invoice.discount"
                    />
                  </Col>
                )}
              </Row>
            </Col>
          </Row>

          {!invoice.isNew && invoice.client && this.state.showEmailModal && (
            <EmailModal
              show={this.state.showEmailModal}
              defaultValue={getDefaultEmailValue(invoice, this.props.config.email)}
              attachmentsAvailable={invoice.attachments.map(a => a.type)}
              title={<EmailModalTitle title={t('email.title')} lastEmail={invoice.lastEmail} />}
              onClose={() => this.setState({showEmailModal: false})}
              onConfirm={(email: EmailModel) => this.props.sendEmail(invoice, email)}
            />
          )}

          <EditInvoiceExtraFields
            forceOpen={this.state.showExtraFields}
            invoice={invoice}
            onChange={this.updateInvoice.bind(this, 'extraFields')}
          />

          <Row style={{marginTop: 8}}>
            <EditInvoiceLines
              invoice={invoice}
              onChange={m => this.setState({invoice: m})}
            />
          </Row>
          <Control.AttachmentsForm model={invoice} />
          <StickyFooter>
            {!invoice.isNew && (
              <Button variant="light" icon="far fa-envelope" onClick={() => this.setState({showEmailModal: true})}>
                {t('email.prepareEmail')}
              </Button>
            )}
            <EditInvoiceSaveButtons onClick={this.props.invoiceAction.bind(this, invoice)} invoice={invoice} />
          </StickyFooter>
        </Form>
      </Container>
    );
  }
}

function mapStateToProps(state: ConfacState, props: any) {
  return {
    config: state.config,
    app: state.app,
    clients: state.clients,
    invoices: state.invoices,
    renavigationKey: props.location.key,
  };
}

export default connect(mapStateToProps, {invoiceAction, sendEmail})(EditInvoice);