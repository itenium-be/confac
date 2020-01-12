import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';
import {t} from '../../utils';

import * as Control from '../../controls';
import InvoiceModel from '../models/InvoiceModel';


type EditInvoiceExtraFieldsProps = {
  invoice: InvoiceModel,
  onChange: any,
  forceOpen: boolean,
}

type EditInvoiceExtraFieldsState = {
  extraFieldFormOpen: boolean,
}

export class EditInvoiceExtraFields extends Component<EditInvoiceExtraFieldsProps, EditInvoiceExtraFieldsState> {
  constructor(props: any) {
    super(props);
    this.state = {extraFieldFormOpen: props.forceOpen};
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.forceOpen !== nextProps.forceOpen) {
      this.setState({extraFieldFormOpen: nextProps.forceOpen});
    }
  }

  render() {
    const {invoice, onChange} = this.props;

    if (!this.props.forceOpen && invoice.extraFields.length === 0) {
      return null;
    }

    return (
      <div>
        <Row>
          <Control.HeaderWithEditIcon
            size={4}
            label={t('extraFields')}
            onEditClick={() => this.setState({extraFieldFormOpen: !this.state.extraFieldFormOpen})}
            data-tst="extra-fields-header-icon"
          />


          {this.state.extraFieldFormOpen ? (
            <Col sm={12} style={{minHeight: 75}}>
              <Control.PropertiesSelect
                label={t('invoice.editExtraFields')}
                value={invoice.extraFields as any}
                onChange={onChange}
                data-tst="invoice.editExtraFields"
              />
            </Col>
          ) : null}
        </Row>


        {invoice.extraFields.length ? (
          <Control.ExtraFieldsInput
            value={invoice.extraFields}
            onChange={onChange}
            data-tst="invoice.editExtraFields"
          />
        ) : null}
      </div>
    );
  }
}
