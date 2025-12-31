import {Button as ReactButton, Modal as ReactModal} from 'react-bootstrap';
import {t} from '../utils';
import {BootstrapVariant} from '../../models';



/**
 * string: open modal for _id
 * null: modal is closed
 * create: open modal for new entity creation
 */
export type ModalState = string | null | 'create';


export type BaseModalProps = {
  show: boolean;
  onClose: () => void;
}


type ModalProps = BaseModalProps & {
  /** Optional confirm button */
  onConfirm?: () => void;
  /**
   * Confirm button text
   * Defaults to "Save"
   */
  confirmText?: string;
  confirmVariant?: BootstrapVariant;
  /** Optional icon class for confirm button (e.g. "fas fa-sync") */
  confirmIcon?: string;
  /** If true, modal stays open after confirm (default: false) */
  stayOpenOnConfirm?: boolean;
  title: string | React.ReactNode;
  extraButtons?: React.ReactNode;
  children: any;
  /** For custom sizing of the Modal etc */
  dialogClassName?: string;
  disableSave?: boolean;
}

export const Modal = (props: ModalProps) => {
  const onConfirm = () => {
    if (props.onConfirm) {
      props.onConfirm();
    }
    if (!props.stayOpenOnConfirm) {
      props.onClose();
    }
  };

  return (
    <ReactModal show={props.show} onHide={props.onClose} dialogClassName={props.dialogClassName}>
      <ReactModal.Header closeButton>
        <ReactModal.Title>{props.title}</ReactModal.Title>
      </ReactModal.Header>
      <ReactModal.Body>
        {props.children}
      </ReactModal.Body>
      <ReactModal.Footer>
        <ReactButton onClick={props.onClose} variant="light" data-testid="close">{t('close')}</ReactButton>
        {props.onConfirm ? (
          <ReactButton onClick={onConfirm} variant={props.confirmVariant || 'success'} disabled={props.disableSave} data-testid="confirm">
            {props.confirmIcon && <i className={props.confirmIcon} style={{marginRight: 6}} />}
            {props.confirmText || t('save')}
          </ReactButton>
        ) : null}
        {props.extraButtons}
      </ReactModal.Footer>
    </ReactModal>
  );
};
