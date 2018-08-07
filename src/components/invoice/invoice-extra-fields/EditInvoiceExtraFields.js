import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {t} from '../../util.js';

import * as Control from '../../controls.js';
import {Row, Col} from 'react-bootstrap';


export class EditInvoiceExtraFields extends Component {
  static propTypes = {
    invoice: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    forceOpen: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {extraFieldFormOpen: props.forceOpen};
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.forceOpen !== nextProps.forceOpen) {
      this.setState({extraFieldFormOpen: nextProps.forceOpen});
    }
  }

  render() {
    const {invoice, onChange} = this.props;

    if (!this.props.forceOpen && invoice.extraFields.length === 0) {
      return <div />;
    }

    return (
      <div>
        <Row>
          <Control.HeaderWithEditIcon
            label={t('extraFields')}
            onEditClick={() => this.setState({extraFieldFormOpen: !this.state.extraFieldFormOpen})}
            data-tst="extra-fields-header-icon"
          />


          {this.state.extraFieldFormOpen ? (
            <Col sm={12} style={{minHeight: 75}}>
              <Control.PropertiesSelect
                label={t('invoice.editExtraFields')}
                values={invoice.extraFields}
                onChange={onChange}
                data-tst="invoice.editExtraFields"
              />
            </Col>
          ) : null}
        </Row>


        {invoice.extraFields.length ? (
          <Row>
            <Control.ExtraFieldsInput
              properties={invoice.extraFields}
              onChange={onChange}
              data-tst="invoice.editExtraFields"
            />
          </Row>
        ) : null}
      </div>
    );
  }
}
