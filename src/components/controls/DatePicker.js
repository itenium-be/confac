import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {t} from '../util';

import {EnhanceInputWithLabel} from '../enhancers/EnhanceInputWithLabel';
import {default as ReactDatePicker} from 'react-datepicker';

export const DatePicker = EnhanceInputWithLabel(class extends Component {
  static propTypes = {
    'data-tst': PropTypes.string.isRequired,
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    return (
      <ReactDatePicker
        className="form-control"
        selected={this.props.value ? this.props.value.toDate() : undefined}
        onChange={dateString => this.props.onChange(dateString ? moment(dateString) : null)}
        locale="nl"
        dateFormat="dd/MM/yyyy"
        peekNextMonth={false}
        todayButton={t('controls.today')}
      />
    );
  }
});
