import React, {Component, PropTypes} from 'react';
import {t} from '../../util.js';

import * as Control from '../../controls.js';
import {Col} from 'react-bootstrap';

export class EditClientRate extends Component {
  static propTypes = {
    rate: PropTypes.shape({
      type: PropTypes.oneOf(Control.invoiceLineTypes).isRequired,
      hoursInDay: PropTypes.number,
      value: PropTypes.number.isRequired, // TODO: rename to price?
      description: PropTypes.string,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
  }
  render() {
    const {rate} = this.props;
    return (
      <div>
        <Col sm={4}>
          <Control.NumericInput
            prefix="€"
            label={t('client.rate.defaultPrice')}
            float
            value={rate.value}
            onChange={value => this.props.onChange({...rate, value: value})}
            data-tst="client.rate.value"
          />
        </Col>

        <Col sm={4}>
          <Control.NumericInput
            label={t('client.rate.hoursInDay')}
            value={rate.hoursInDay}
            onChange={value => this.props.onChange({...rate, hoursInDay: value})}
            data-tst="client.rate.hoursInDay"
          />
        </Col>
        <Col sm={4}>
          <Control.InvoiceLineTypeSelect
            label={t('config.defaultInvoiceLineType')}
            type={rate.type}
            onChange={value => this.props.onChange({...rate, type: value})}
            data-tst="client.rate.type"
          />
        </Col>

        <Col sm={4}>
          <Control.StringInput
            label={t('client.rate.desc')}
            value={rate.description}
            onChange={value => this.props.onChange({...rate, description: value})}
            data-tst="client.rate.desc"
          />
        </Col>

      </div>
    );
  }
}
