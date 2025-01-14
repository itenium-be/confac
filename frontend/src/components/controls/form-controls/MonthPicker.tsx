import moment from 'moment';
import {BaseInputProps} from './inputs/BaseInput';
import {DatePicker} from './DatePicker';



type DatePickerProps = BaseInputProps<moment.Moment | null> & {
  placeholder?: string;
};



export const MonthPicker = (props: DatePickerProps) => {
  const {onChange, ...rest} = props;
  return (
    <DatePicker
      dateFormat="MMMM - yyyy"
      showMonthYearPicker
      onChange={(date: moment.Moment | null) => props.onChange(date)}
      {...rest}
    />
  );
};
