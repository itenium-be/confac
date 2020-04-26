import React from 'react';
import {OverlayTrigger, Popover} from 'react-bootstrap';
import {BaseInput, BaseInputProps} from '../../controls/form-controls/inputs/BaseInput';
import {Icon} from '../../controls/Icon';
import {t} from '../../utils';
import {invoiceReplacementsPopoverConfig} from '../invoice-replacements';

type InvoiceReplacementsInputProps = BaseInputProps<string>;

export const InvoiceReplacementsInput = ({value, onChange, ...props}: InvoiceReplacementsInputProps) => {
  return (
    <BaseInput
      type="text"
      value={value || ''}
      onChange={e => onChange(e.target.value as string)}
      {...props}
      suffix={(
        <OverlayTrigger trigger="click" placement="top" overlay={InvoiceReplacementsPopover}>
          <button className="btn input-group-text" type="button">
            <Icon fa="fa fa-file-invoice" size={1} />
          </button>
        </OverlayTrigger>
        )}
      suffixOptions={{type: 'button'}}
    />
  );
};



const InvoiceReplacementsPopover = (
  <Popover id="invoice-replacements">
    <Popover.Title as="h3">{t('config.invoiceReplacements.title')}</Popover.Title>
    <Popover.Content>
      {invoiceReplacementsPopoverConfig.map((replacement, index) => (
        <div key={index}>
          <strong>{replacement.code}</strong>
          <p>{t(replacement.desc)}</p>
        </div>
      ))}
    </Popover.Content>
  </Popover>
);
