import React from 'react';
import {EditorState} from 'draft-js';
import {BaseInputProps} from '../../controls/form-controls/inputs/BaseInput';
import {TextEditor} from '../../controls/form-controls/inputs/TextEditor';
import {InvoiceTextEditorReplacements} from './InvoiceTextEditorReplacements';

type InvoiceReplacementsTextEditorProps = BaseInputProps<string>;

export const InvoiceReplacementsTextEditor = (props: InvoiceReplacementsTextEditorProps) => {
  const getToolbarCustomButtons = (editorState: EditorState) => (
    [<InvoiceTextEditorReplacements editorState={editorState} />]
  );

  return (
    <TextEditor
      getToolbarCustomButtons={editorState => getToolbarCustomButtons(editorState)}
      {...props}
    />
  );
};
