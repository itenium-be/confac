import React from 'react';
import {OverlayTrigger, Popover, InputGroup} from 'react-bootstrap';
import {BaseInput, BaseInputProps} from '../../controls/form-controls/inputs/BaseInput';
import {Icon} from '../../controls/Icon';
import {t} from '../../utils';
import {invoiceReplacementsPopoverConfig} from '../invoice-replacements';

type InvoiceReplacementsInputProps = BaseInputProps<string>

export const InvoiceReplacementsInput = ({value, onChange, ...props}: InvoiceReplacementsInputProps) => (
  <BaseInput
    type="text"
    value={value || ''}
    onChange={e => onChange(e.target.value as string)}
    {...props}
    suffix={(
      <OverlayTrigger trigger="click" placement="auto" overlay={InvoiceReplacementsPopover}>
        <InputGroup.Text style={{cursor: 'pointer'}}>
          <Icon fa="fa fa-file-invoice" size={1} />
        </InputGroup.Text>
      </OverlayTrigger>
      )}
    suffixOptions={{type: 'button'}}
  />
);



const InvoiceReplacementsPopover = (
  <Popover id="invoice-replacements">
    <Popover.Header as="h3">{t('config.invoiceReplacements.title')}</Popover.Header>
    <Popover.Body>
      {invoiceReplacementsPopoverConfig.map((replacement, index) => (
        <div key={index}>
          <strong>{replacement.code}</strong>
          <p>{t(replacement.desc)}</p>
        </div>
      ))}
    </Popover.Body>
  </Popover>
);
