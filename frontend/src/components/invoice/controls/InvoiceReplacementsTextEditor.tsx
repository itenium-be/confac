import {EditorState} from 'draft-js';
import {BaseInputProps} from '../../controls/form-controls/inputs/BaseInput';
import {TextEditor} from '../../controls/form-controls/inputs/TextEditor';
import {TextEditorReplacements} from '../../controls/form-controls/inputs/TextEditorReplacements';
import {invoiceReplacementsPopoverConfig} from '../invoice-replacements';

type InvoiceReplacementsTextEditorProps = BaseInputProps<string>;

export const InvoiceReplacementsTextEditor = (props: InvoiceReplacementsTextEditorProps) => {
  const getToolbarCustomButtons = (editorState: EditorState) => (
    [<TextEditorReplacements editorState={editorState} replacements={invoiceReplacementsPopoverConfig} />]
  );

  return (
    <TextEditor
      getToolbarCustomButtons={editorState => getToolbarCustomButtons(editorState)}
      {...props}
    />
  );
};
