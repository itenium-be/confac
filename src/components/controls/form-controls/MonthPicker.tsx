import React from 'react';
import moment from 'moment';
import {BaseInputProps} from './inputs/BaseInput';
import {DatePicker} from './DatePicker';



type DatePickerProps = BaseInputProps<moment.Moment | null> & {
  placeholder?: string;
};



export const MonthPicker = (props: DatePickerProps) => {
  return (
    <DatePicker
      dateFormat="MMMM - yyyy"
      showMonthYearPicker
      {...props}
    />
  );
};
