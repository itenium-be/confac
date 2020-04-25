/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, {useState} from 'react';
import {Modifier, EditorState} from 'draft-js';
import {t} from '../../utils';
import {invoiceReplacementsPopoverConfig} from '../invoice-replacements';


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
