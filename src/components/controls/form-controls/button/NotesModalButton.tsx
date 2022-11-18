import React, {useState} from 'react';
import {MinimalInputProps} from '../inputs/BaseInput';
import {Button} from '../Button';
import {Modal} from '../../Modal';
import {t} from '../../../utils';
import {TextEditor} from '../inputs/TextEditor';
import {BootstrapVariant} from '../../../../models';
import {Claim} from '../../../users/models/UserModel';
import {authService} from '../../../users/authService';


type NotesModalButtonProps = MinimalInputProps<string> & {
  title: string;
  variant?: BootstrapVariant;
  claim: Claim;
};


export const NotesModalButton = ({claim, value, onChange, title, variant, disabled}: NotesModalButtonProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [text, setText] = useState<string>(value || '');

  const icon = !value ? 'far fa-comment' : 'far fa-comment-dots';
  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        variant={variant || 'outline-dark'}
        title={text || t('projectMonth.addNote')}
        icon={icon}
      />
      {open && (
        <Modal
          show
          onClose={() => setOpen(false)}
          onConfirm={!disabled && authService.getClaims().includes(claim) ? () => onChange(text) : undefined}
          title={title}
        >
          <TextEditor
            value={text}
            onChange={val => setText(val)}
            style={{height: 300}}
          />

        </Modal>
      )}
    </>
  );
};
