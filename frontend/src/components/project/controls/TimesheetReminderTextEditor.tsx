import {EditorState} from 'draft-js';
import {BaseInputProps} from '../../controls/form-controls/inputs/BaseInput';
import {TextEditor} from '../../controls/form-controls/inputs/TextEditor';
import {TextEditorReplacements} from '../../controls/form-controls/inputs/TextEditorReplacements';
import {timesheetReminderReplacementsConfig} from '../project-month-list/timesheet-reminder';


export const TimesheetReminderTextEditor = (props: BaseInputProps<string>) => (
  <TextEditor
    getToolbarCustomButtons={(editorState: EditorState) => (
      [<TextEditorReplacements key="replacements" editorState={editorState} replacements={timesheetReminderReplacementsConfig} />]
    )}
    {...props}
  />
);
