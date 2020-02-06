/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {useState} from 'react';
import moment from 'moment';
import ReactDatePicker from 'react-datepicker';
import {t, datePickerDateFormat, defaultLocale} from '../../utils';
import {EnhanceInputWithLabel} from '../../enhancers/EnhanceInputWithLabel';
import {BaseInputProps} from './inputs/BaseInput';


import './DatePicker.scss';


type DatePickerProps = BaseInputProps<moment.Moment | null> & {
  showMonthYearPicker?: boolean;
  dateFormat?: string;
  placeholder?: string;
};


export const DatePicker = EnhanceInputWithLabel((props: DatePickerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="input-group date-group">
      <ReactDatePicker
        className="form-control"
        selected={props.value ? props.value.toDate() : undefined}
        onChange={dateString => {
          props.onChange(dateString ? moment(dateString) : null);
          setOpen(false);
        }}
        locale={defaultLocale}
        dateFormat={props.dateFormat || datePickerDateFormat}
        peekNextMonth={false}
        todayButton={t('controls.today')}
        showMonthYearPicker={props.showMonthYearPicker}
        open={open}
        placeholderText={props.placeholder}
      />
      <div className="input-group-append" onClick={() => setOpen(!open)}>
        <div className="input-group-text">
          <i className="fa fa-calendar" />
        </div>
      </div>
    </div>
  );
});
