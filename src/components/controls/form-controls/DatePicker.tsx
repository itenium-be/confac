import React, {Component} from 'react';
import moment from 'moment';
import {t} from '../../util';
import {EnhanceInputWithLabel} from '../../enhancers/EnhanceInputWithLabel';
import {default as ReactDatePicker} from 'react-datepicker';
import { BaseInputProps } from './inputs/BaseInput';

type DatePickerProps = BaseInputProps<moment.Moment | null>;

export const DatePicker = EnhanceInputWithLabel(class extends Component<DatePickerProps> {
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