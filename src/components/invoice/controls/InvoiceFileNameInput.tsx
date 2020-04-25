import React from 'react';
import {OverlayTrigger, Popover} from 'react-bootstrap';
import {BaseInput, BaseInputProps} from '../../controls/form-controls/inputs/BaseInput';
import {Icon} from '../../controls/Icon';
import {t} from '../../utils';

type InvoiceFileNameInputProps = BaseInputProps<string>;

export const InvoiceFileNameInput = ({value, onChange, ...props}: InvoiceFileNameInputProps) => {
  return (
    <BaseInput
      type="text"
      value={value || ''}
      onChange={e => onChange(e.target.value as string)}
      {...props}
      suffix={(
        <OverlayTrigger trigger="click" placement="right" overlay={InvoiceFileNameReplacementsPopover}>
          <button className="btn input-group-text" type="button">
            <Icon fa="fa fa-file-invoice" size={1} />
          </button>
        </OverlayTrigger>
        )}
      suffixOptions={{type: 'button'}}
    />
  );
};



const replacements = [
  {code: '{nr}', desc: 'config.invoiceFileNameReplacements.nr'},
  {code: '{nr:X}', desc: 'config.invoiceFileNameReplacements.nrX'},
  {code: '{date:FORMAT}', desc: 'config.invoiceFileNameReplacements.date'},
  {code: '{orderNr}', desc: 'config.invoiceFileNameReplacements.orderNr'},
  {code: '{clientName}', desc: 'config.invoiceFileNameReplacements.clientName'},
  // {code: '', desc: 'config.invoiceFileNameReplacements.'},
  // {code: '', desc: 'config.invoiceFileNameReplacements.'},
  // {code: '', desc: 'config.invoiceFileNameReplacements.'},
];



/** ATTN: Keep download-helpers::invoiceReplacements in sync! */
const InvoiceFileNameReplacementsPopover = (
  <Popover id="invoice-filenames-replacement">
    <Popover.Title as="h3">{t('config.invoiceFileNameReplacements.title')}</Popover.Title>
    <Popover.Content>
      {replacements.map((replacement, index) => (
        <div key={index}>
          <strong>{replacement.code}</strong>
          <p>{t(replacement.desc)}</p>
        </div>
      ))}
    </Popover.Content>
  </Popover>
);
