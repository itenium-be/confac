import React, {Component, PropTypes} from 'react';
import {t} from '../../util.js';

import {NumericInput, StringInput} from '../../controls.js';
import {Col} from 'react-bootstrap';

export class EditClientRate extends Component {
  static propTypes = {
    rate: PropTypes.shape({
      type: PropTypes.oneOf(['hourly']).isRequired,
      hoursInDay: PropTypes.number,
      value: PropTypes.number.isRequired,
      description: PropTypes.string,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
  }
  render() {
    const {rate} = this.props;
    return (
      <div>
        <Col sm={4}>
          <StringInput
            label={t('client.rate.desc')}
            value={rate.description}
            onChange={value => this.props.onChange({...rate, description: value})}
          />
        </Col>
        <Col sm={4}>
          <NumericInput
            prefix="€"
            label={t('client.hourlyRate')}
            value={rate.value}
            onChange={value => this.props.onChange({...rate, value: value})}
          />
        </Col>
        <Col sm={4}>
          <NumericInput
            label={t('client.rate.hoursInDay')}
            value={rate.hoursInDay}
            onChange={value => this.props.onChange({...rate, hoursInDay: value})}
          />
        </Col>

      </div>
    );
  }
}
