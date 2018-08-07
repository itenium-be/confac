import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { t } from '../util.js';

import {EnhanceIputWithLabel} from './Inputs.js';
import BootstrapDatePicker from 'react-bootstrap-date-picker';

export const DatePicker = EnhanceIputWithLabel(class extends Component {
  static propTypes = {
    'data-tst': PropTypes.string.isRequired,
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired,
  }

  // calendarContainer={document.body}:
  // Workaround for making the dropdown visible when placed
  // in the second cell of a container with className split

  render() {
    return (
      <BootstrapDatePicker
        value={this.props.value ? this.props.value.toISOString() : undefined}
        onChange={dateString => this.props.onChange(dateString ? moment(dateString) : null)}
        dateFormat="DD/MM/YYYY"
        monthLabels={['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'October', 'November', 'December']}
        dayLabels={['Zon', 'Ma', 'Di', 'Woe', 'Do', 'Vr', 'Zat']}
        showTodayButton={true}
        todayButtonLabel={t('controls.today')}
        weekStartsOnMonday={true}
        calendarContainer={document.body}
        className={'tst-' + this.props['data-tst']}
      />
    );
  }
});
