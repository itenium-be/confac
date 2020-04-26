import React, {useState} from 'react';
import {MinimalInputProps} from '../inputs/BaseInput';
import {Button} from '../Button';
import {Modal} from '../../Modal';
import {TextareaInput} from '../inputs/TextareaInput';
import {t} from '../../../utils';


type NotesModalButtonProps = MinimalInputProps<string> & {
  title: string;
};


export const NotesModalButton = ({value, onChange, title}: NotesModalButtonProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [text, setText] = useState<string>(value || '');

  const icon = !value ? 'far fa-comment' : 'far fa-comment-dots';
  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        variant="outline-dark"
        title={text || t('projectMonth.addNote')}
        icon={icon}
      />
      {open && (
        <Modal
          show
          onClose={() => setOpen(false)}
          onConfirm={() => onChange(text)}
          title={title}
        >
          <TextareaInput
            value={text}
            onChange={val => setText(val)}
            style={{height: 300}}
          />

        </Modal>
      )}
    </>
  );
};
