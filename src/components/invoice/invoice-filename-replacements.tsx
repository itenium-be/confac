/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, {useState} from 'react';
import {Modifier, EditorState} from 'draft-js';
import InvoiceModel from './models/InvoiceModel';
import {t} from '../utils';

export function invoiceReplacements(input: string, invoice: InvoiceModel): string {
  let str = input;

  const nrRegex = /\{nr:(\d+)\}/;
  const nrMatch = str.match(nrRegex);
  if (nrMatch) {
    const nrSize = Math.max(parseInt(nrMatch[1], 10), invoice.number.toString().length);
    str = str.replace(nrRegex, (`000000${invoice.number}`).slice(-nrSize));
  }

  str = str.replace(/\{nr\}/g, invoice.number.toString());

  const dateRegex = /\{date:([^}]+)\}/;
  const dateMatch = str.match(dateRegex);
  if (dateMatch && invoice.date) {
    const dateFormat = dateMatch[1];
    str = str.replace(dateRegex, invoice.date.format(dateFormat));
  }

  if (str.indexOf('{orderNr}') !== -1) {
    str = str.replace('{orderNr}', invoice.orderNr);
  }

  if (str.indexOf('{clientName}') !== -1) {
    str = str.replace('{clientName}', invoice.client.name);
  }

  // Object.keys(data).forEach(invoiceProp => {
  //   str = str.replace('{' + invoiceProp + '}', data[invoiceProp]);
  // });

  return str;
}



/** Used by the InvoiceReplacementsInput popover */
export const invoiceReplacementsPopoverConfig = [
  {code: '{nr}', desc: 'config.invoiceReplacements.nr'},
  {code: '{nr:X}', desc: 'config.invoiceReplacements.nrX', defaultValue: '{nr:4}'},
  {code: '{date:FORMAT}', desc: 'config.invoiceReplacements.date', defaultValue: '{date:YYYY-MM}'},
  {code: '{orderNr}', desc: 'config.invoiceReplacements.orderNr'},
  {code: '{clientName}', desc: 'config.invoiceReplacements.clientName'},
  // {code: '', desc: 'config.invoiceReplacements.'},
  // {code: '', desc: 'config.invoiceReplacements.'},
  // {code: '', desc: 'config.invoiceReplacements.'},
];


type InvoiceTextEditorReplacementsProps = {
  onChange?: (editorState: EditorState) => void,
  editorState: EditorState,
}


export const InvoiceTextEditorReplacements = ({onChange, editorState}: InvoiceTextEditorReplacementsProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const addPlaceholder = (placeholder: string): void => {
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      placeholder,
      editorState.getCurrentInlineStyle(),
    );
    const result = EditorState.push(editorState, contentState, 'insert-characters');
    if (onChange) {
      onChange(result);
    }
  };

  return (
    <div onClick={() => setOpen(!open)} className="rdw-block-wrapper" aria-label="rdw-block-control" role="button" tabIndex={0}>
      <div className="rdw-dropdown-wrapper rdw-block-dropdown" aria-label="rdw-dropdown" style={{width: 180}}>
        <div className="rdw-dropdown-selectedtext">
          <span>{t('config.invoiceReplacements.title')}</span>
          <div className={`rdw-dropdown-caretto${open ? 'close' : 'open'}`} />
        </div>
        <ul className={`rdw-dropdown-optionwrapper ${open ? '' : 'placeholder-ul'}`}>
          {invoiceReplacementsPopoverConfig.map(item => (
            <li
              onClick={() => addPlaceholder(item.defaultValue || item.code)}
              key={item.code}
              className="rdw-dropdownoption-default placeholder-li"
            >
              {item.code.replace(/\{|\}/g, '')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
