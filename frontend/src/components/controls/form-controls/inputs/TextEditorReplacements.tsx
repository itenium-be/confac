/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import {useState} from 'react';
import {Modifier, EditorState, ContentState} from 'draft-js';
import {t} from '../../../utils';
import {ITextEditorCustomReplacement} from '../../../invoice/invoice-replacements';


type TextEditorReplacementsProps = {
  onChange?: (editorState: EditorState) => void,
  editorState: EditorState,
  replacements: ITextEditorCustomReplacement[]
}



export const TextEditorReplacements = ({onChange, editorState, replacements}: TextEditorReplacementsProps) => {
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

  const clearText = (): void => {
    const contentState = ContentState.createFromText('');
    const result = EditorState.push(editorState, contentState, 'remove-range');
    if (onChange) {
      onChange(result);
    }
  };

  return (
    <>
      <div onClick={() => setOpen(!open)} className="rdw-block-wrapper" aria-label="rdw-block-control" role="button" tabIndex={0}>
        <div className="rdw-dropdown-wrapper rdw-block-dropdown" aria-label="rdw-dropdown" style={{width: 180}}>
          <div className="rdw-dropdown-selectedtext">
            <span>{t('config.invoiceReplacements.title')}</span>
            <div className={`rdw-dropdown-caretto${open ? 'close' : 'open'}`} />
          </div>
          <ul className={`rdw-dropdown-optionwrapper ${open ? '' : 'placeholder-ul'}`}>
            {replacements.map(item => (
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
      <div className="rdw-inline-wrapper" aria-label="rdw-inline-control">
        <div
          className="rdw-option-wrapper"
          aria-selected={false}
          title={t("config.invoiceReplacements.clearButton")}
          onClick={() => clearText()}
        >
          {t("config.invoiceReplacements.clearButton")}
        </div>
      </div>
    </>

  );
};
