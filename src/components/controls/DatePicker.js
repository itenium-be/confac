import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { t } from '../util.js';

import {EnhanceInputWithLabel} from '../enhancers/EnhanceInputWithLabel.js';
import {default as ReactDatePicker} from 'react-datepicker';

import { registerLocale, setDefaultLocale } from  "react-datepicker";
import nl from 'date-fns/locale/nl';
registerLocale('nl', nl);
setDefaultLocale('nl');


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
