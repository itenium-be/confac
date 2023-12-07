import React from 'react';
import {useSelector} from 'react-redux';
import {StringsSelect} from '../form-controls/select/StringsSelect';
import {BaseInputProps} from '../form-controls/inputs/BaseInput';
import {ConfacState} from '../../../reducers/app-state';

export type AttachmentsTypeSelectProps = BaseInputProps<string[]>

export const AttachmentsTypeSelect = ({value, onChange, ...props}: AttachmentsTypeSelectProps) => {
  const options = useSelector((state: ConfacState) => state.config.attachmentTypes);

  return (
    <StringsSelect
      value={value}
      onChange={onChange}
      options={[...options, 'pdf', 'xml']}
      {...props}
    />
  );
};
