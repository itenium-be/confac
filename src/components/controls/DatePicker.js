import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { t } from '../util.js';

import {EnhanceInputWithLabel} from '../enhancers/EnhanceInputWithLabel.js';
import BootstrapDatePicker from 'react-16-bootstrap-date-picker';

export const DatePicker = EnhanceInputWithLabel(class extends Component {
  static propTypes = {
    'data-tst': PropTypes.string.isRequired,
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired,
  }

  // calendarContainer={document.body}:
  // Workaround for making the dropdown visible when placed
  // in the second cell of a container with className split

  render() {
    const MONDAY = 1;
    return (
      <BootstrapDatePicker
        value={this.props.value ? this.props.value.toISOString() : undefined}
        onChange={dateString => this.props.onChange(dateString ? moment(dateString) : null)}
        dateFormat="DD/MM/YYYY"
        monthLabels={['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'October', 'November', 'December']}
        dayLabels={['Zon', 'Ma', 'Di', 'Woe', 'Do', 'Vr', 'Zat']}
        showTodayButton={true}
        todayButtonLabel={t('controls.today')}
        weekStartsOn={MONDAY}
        calendarContainer={document.body}
        className={'tst-' + this.props['data-tst']}
      />
    );
  }
});
