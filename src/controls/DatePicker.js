import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import BootstrapDatePicker from 'react-bootstrap-date-picker';

export class DatePicker extends Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    return (
      <BootstrapDatePicker
        value={this.props.value ? this.props.value.toISOString() : undefined}
        onChange={dateString => this.props.onChange(dateString ? moment(dateString) : null)}
        dateFormat="DD/MM/YYYY"
        monthLabels={['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'October', 'November', 'December']}
        dayLabels={['Zon', 'Ma', 'Di', 'Woe', 'Do', 'Vr', 'Zat']}
      />
    );
  }
}
