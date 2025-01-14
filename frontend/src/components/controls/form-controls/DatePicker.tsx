/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {useState} from 'react';
import moment from 'moment';
import ReactDatePicker from 'react-datepicker';
import {t, datePickerDateFormat, defaultLocale} from '../../utils';
import {EnhanceInputWithLabel} from '../../enhancers/EnhanceInputWithLabel';
import {BaseInputProps} from './inputs/BaseInput';
import {EnhanceInputWithDisplay} from '../../enhancers/EnhanceInputWithAddons';


import './DatePicker.scss';


type DatePickerProps = BaseInputProps<moment.Moment | null> & {
  showMonthYearPicker?: boolean;
  dateFormat?: string;
  placeholder?: string;
};


/**
 * DatePicker returns a local time ISO Date.
 * This function converts it to an UTC Moment.
 */
export function utcFix(date: Date | null): moment.Moment | null {
  if (!date) {
    return null;
  }

  const localMoment = moment(date).startOf('day');
  const utcMoment = localMoment.clone().utc().add(localMoment.utcOffset(), 'm');
  return utcMoment;
}


export const DatePicker = EnhanceInputWithDisplay(EnhanceInputWithLabel((props: DatePickerProps) => {
  const [open, setOpen] = useState(false);


  if (props.value && typeof props.value === 'string') {
    // eslint-disable-next-line no-console
    console.error('DatePicker unexpected string input ', props);
    // eslint-disable-next-line no-console
    console.info('Map to a moment instance in the reducer map function');
    // eslint-disable-next-line react/jsx-one-expression-per-line
    return <div>INVALID DATE INPUT: {props.value}</div>;
  }

  return (
    <div className="input-group date-group">
      <ReactDatePicker
        className="form-control"
        selected={props.value ? props.value.toDate() : undefined}
        onChange={(date: Date | null) => {
          props.onChange(utcFix(date));
          if (open) {
            setOpen(false);
          }
        }}
        locale={defaultLocale}
        dateFormat={props.dateFormat || datePickerDateFormat}
        peekNextMonth={false}
        todayButton={props.showMonthYearPicker ? undefined : t('controls.today')}
        showMonthYearPicker={props.showMonthYearPicker}
        open={open}
        placeholderText={props.placeholder}
      />
      <div className="input-group-text" onClick={() => setOpen(!open)}>
        <i className="fa fa-calendar-alt" />
      </div>
    </div>
  );
}));
