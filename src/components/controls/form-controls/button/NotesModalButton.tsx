import React, {useState} from 'react';
import {MinimalInputProps} from '../inputs/BaseInput';
import {Icon} from '../../Icon';
import {Button} from '../Button';
import {Modal} from '../../Modal';
import {TextareaInput} from '../inputs/TextareaInput';


type NotesModalButtonProps = MinimalInputProps<string> & {
  title: string;
};


export const NotesModalButton = ({value, onChange, title}: NotesModalButtonProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [text, setText] = useState<string>(value || '');

  const icon = !value ? 'far fa-comment' : 'far fa-comment-dots';
  return (
    <>
      <Button size="md" onClick={() => setOpen(!open)} variant="outline-dark">
        <Icon fa={icon} size={1} title={text} />
      </Button>
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
