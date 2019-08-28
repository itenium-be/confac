import React, {Component} from 'react';
import {connect} from 'react-redux';
import {t, EditInvoiceViewModel} from '../util';
import moment from 'moment';
import * as Control from '../controls';
import {Container, Row, Col, Form} from 'react-bootstrap';
import EditInvoiceLines from './EditInvoiceLines';
import InvoiceNotVerifiedAlert from './controls/InvoiceNotVerifiedAlert';
import {EditInvoiceSaveButtons} from './controls/EditInvoiceSaveButtons';
import {invoiceAction} from '../../actions/index';
import {EditInvoiceClient} from './invoice-client/EditInvoiceClient';
import {EditInvoiceExtraFields} from './invoice-extra-fields/EditInvoiceExtraFields';
import EditInvoiceModel from './EditInvoiceModel';
import { EditConfigModel } from '../config/EditConfigModel';
import { EditClientModel } from '../client/ClientModels';


type EditInvoiceProps = {
  invoices: EditInvoiceModel[],
  config: EditConfigModel,
  app: {isLoaded: boolean},
  clients: EditClientModel[],
  invoiceAction: Function,
  match: {
    params: {
      id: string
    }
  },
  renavigationKey: string,
}

type EditInvoiceState = {
  invoice: EditInvoiceModel,
  showExtraFields: boolean,
  renavigationKey: string,
}

export class EditInvoice extends Component<EditInvoiceProps, EditInvoiceState> {
  get isQuotation(): boolean {
    return window.location.pathname.startsWith('/quotation/');
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
    };
  }

  createModel(props) {
    const invoicesOrQuotations = this.isQuotation ? props.invoices.filter(x => x.isQuotation) : props.invoices.filter(x => !x.isQuotation);
    if (props.match.params.id) {
      // Existing invoice / quotation
      const invoice = invoicesOrQuotations.find(i => i.number === parseInt(props.match.params.id, 10));
      return new EditInvoiceViewModel(props.config, invoice);

    } else {
      // New invoice / quotation
      var client;
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

  updateInvoice(key, value, calcMoneys = false) {
    // Naughty naughty: We are manipulating state directly!
    // To fix this: state should be a regular object, and a
    // EditInvoiceViewModel should be created in the render
    this.state.invoice.updateField(key, value, calcMoneys);
    this.forceUpdate();
  }

  render() {
    const {invoice} = this.state;
    const extraFieldsVisible = invoice.extraFields.length === 0 && !this.state.showExtraFields;
    return (
      <Container className="edit-container">
        <Form>
          <Row>
            <h1>
              {invoice._id ? t(this.type + '.editTitle') : t(this.type + '.createTitle')}
              {invoice.createdOn && <small className="created-on">{t('createdOn')} {moment(invoice.createdOn).format('DD/MM/YYYY')}</small>}
            </h1>

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
                  onChange={(fieldName, value) => this.updateInvoice(fieldName, value)}
                />

                {extraFieldsVisible ? (
                  <Col sm={12}>
                    <Control.DownArrowIcon
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
          <div style={{marginTop: -20}}>
            <Control.AttachmentsForm model={invoice} />
          </div>
          <Row style={{marginBottom: 8, marginTop: 20}}>
            <Col>
              <EditInvoiceSaveButtons onClick={this.props.invoiceAction.bind(this, invoice)} invoice={invoice} />
            </Col>
          </Row>
        </Form>
      </Container>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    config: state.config,
    app: state.app,
    clients: state.clients,
    invoices: state.invoices,
    renavigationKey: props.location.key,
  };
}

export default connect(mapStateToProps, {invoiceAction})(EditInvoice);



const EditInvoiceDetails = ({invoice, onChange}) => {
  const tp = transKey => t((invoice.getType()) + transKey);
  return (
    <>
      <Col sm={6}>
        <Control.NumericInput
          prefix={invoice.verified ? <Control.VerifyIcon style={{fontSize: 16}} title={t('invoice.isVerified')} data-tst="invoice-is-verified" /> : undefined}
          label={tp('.number')}
          value={invoice.number}
          onChange={value => onChange('number', value)}
          data-tst="invoice.number"
        />
      </Col>
      <Col sm={6}>
        <Control.DatePicker
          label={tp('.date')}
          value={invoice.date}
          onChange={value => onChange('date', value)}
          data-tst="invoice.date"
        />
      </Col>

      <Col sm={6}>
        <Control.StringInput
          label={t('invoice.orderNr')}
          value={invoice.orderNr}
          onChange={value => onChange('orderNr', value)}
          data-tst="invoice.orderNr"
        />
      </Col>
      <Col sm={6}>
        <Control.StringInput
          label={tp('.fileName')}
          value={invoice.fileName}
          onChange={value => onChange('fileName', value)}
          data-tst="invoice.fileName"
        />
      </Col>
    </>
  );
};
