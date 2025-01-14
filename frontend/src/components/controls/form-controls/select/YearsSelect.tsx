import {BaseSelect} from './BaseSelect';
import {SelectItem} from '../../../../models';

export type YearsSelectProps = {
  values: number[];
  years: number[];
  onChange: (newYears: number[]) => void;
  label?: string;
};

export const YearsSelect = ({values, years, onChange, ...props}: YearsSelectProps) => (
  <BaseSelect
    value={values.map(y => ({label: y, value: y}))}
    onChange={(newYears: SelectItem[]) => onChange((newYears || []).map(itm => itm.value as number))}
    options={years.map(y => ({label: y, value: y}))}
    isClearable
    isMulti
    {...props}
  />
);
