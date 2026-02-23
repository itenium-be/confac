import Creatable from 'react-select/creatable';
import {SelectItem} from '../../../../models';
import {t} from '../../../utils';


export type SimpleCreatableSelectProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  isClearable?: boolean;
};


export const SimpleCreatableSelect = ({options, value, onChange, isClearable = false, ..._props}: SimpleCreatableSelectProps) => {
  const opts = options.map((itm: string) => ({
    label: itm,
    value: itm,
  }));

  return (
    <Creatable
      value={{label: value, value}}
      options={opts}
      onChange={(itm: SelectItem | null) => onChange(itm ? String(itm.value) : '')}
      isClearable={isClearable}
      isMulti={false}
      noOptionsMessage={() => t('controls.noResultsText')}
      formatCreateLabel={(itm: string) => t('controls.addLabelText', {value: itm})}
      placeholder={t('controls.selectPlaceholder')}
      classNamePrefix="react-select"
      className="react-select-simple"
    />
  );
};
