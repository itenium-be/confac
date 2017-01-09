import React, { Component, PropTypes } from 'react';
import moment from 'moment';

import { LabeledInput } from './Inputs.js';
import BootstrapDatePicker from 'react-bootstrap-date-picker';

export class DatePicker extends Component {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    const Picker = (
      <BootstrapDatePicker
        value={this.props.value ? this.props.value.toISOString() : undefined}
        onChange={dateString => this.props.onChange(dateString ? moment(dateString) : null)}
        dateFormat="DD/MM/YYYY"
        monthLabels={['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'October', 'November', 'December']}
        dayLabels={['Zon', 'Ma', 'Di', 'Woe', 'Do', 'Vr', 'Zat']}
      />
    );

    if (this.props.label) {
      return <LabeledInput label={this.props.label}>{Picker}</LabeledInput>;
    }
    return Picker;
  }
}
