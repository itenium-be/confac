import {CSSProperties, useState} from 'react';
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
  claim?: Claim;
  style?: CSSProperties;
};


export const NotesModalButton = ({claim, value, onChange, title, variant, disabled, style}: NotesModalButtonProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [text, setText] = useState<string>(value || '');

  const icon = !value ? 'far fa-comment' : 'far fa-comment-dots';
  const showConfirm = !disabled && (!claim || (claim && authService.getClaims().includes(claim)));

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        variant={variant || 'outline-dark'}
        title={text || t('projectMonth.addNote')}
        icon={icon}
        style={style}
        className="tst-add-note"
      />
      {open && (
        <Modal
          show
          onClose={() => setOpen(false)}
          onConfirm={showConfirm ? () => onChange(text) : undefined}
          title={title}
          dialogClassName="notes-modal"
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
