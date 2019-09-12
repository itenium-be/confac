import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { BaseInputProps } from './BaseInput';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { EnhanceInputWithLabel } from '../../../enhancers/EnhanceInputWithLabel';

type TextEditorProps = BaseInputProps<string>;
type TextEditorState = {
  editorState: EditorState,
  defaultValue: string,
}

class TextEditorComponent extends Component<TextEditorProps, TextEditorState> {
  constructor(props: TextEditorProps) {
    super(props);
    if (props.value) {
      this.state = TextEditorComponent.getDerivedStateFromProps(props, {} as TextEditorState) as TextEditorState;
    } else {
      this.state = {editorState: EditorState.createEmpty(), defaultValue: ''};
    }
  }

  static getDerivedStateFromProps(props: TextEditorProps, state: TextEditorState) {
    if (props.value !== state.defaultValue) {
      // console.log('props', props.value, state.defaultValue);
      const contentBlock = htmlToDraft(props.value);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        return {
          editorState,
          defaultValue: props.value || '',
        };
      }
    }
    return null;
  }

  onEditorStateChange = (editorState: EditorState): void => {
    let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    if (html.trim() === '<p></p>') {
      html = '';
    }
    this.setState({ editorState, defaultValue: html });
    this.props.onChange(html);
  };

  render() {
    const { editorState } = this.state;
    return (
      <div style={{height: 300, overflowY: 'auto'}} className="form-control">
        <Editor
          toolbarOnFocus={false}
          toolbarHidden={false}
          toolbar={{
            inline: {
              options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],
            },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
          }}
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
        />

      </div>
    );
  }
}

export const TextEditor = EnhanceInputWithLabel(TextEditorComponent);
