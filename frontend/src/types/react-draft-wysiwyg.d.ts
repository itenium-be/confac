declare module 'react-draft-wysiwyg' {
  import {Component} from 'react';
  import {EditorState} from 'draft-js';

  interface EditorProps {
    editorState?: EditorState;
    onEditorStateChange?: (editorState: EditorState) => void;
    toolbar?: Record<string, unknown>;
    wrapperClassName?: string;
    editorClassName?: string;
    toolbarClassName?: string;
    readOnly?: boolean;
    placeholder?: string;
    [key: string]: unknown;
  }

  export class Editor extends Component<EditorProps> {}
}
