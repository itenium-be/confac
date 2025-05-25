import {Blocker} from 'react-router';
import {t} from '../../utils';
import {Modal} from 'react-bootstrap';
import {Button} from '../form-controls/Button';

type ChangesModalProps = {
  blocker: Blocker;
}

export const ChangesModal = ({blocker}: ChangesModalProps) => {
  if (blocker.state !== 'blocked') {
    return null;
  }

  return (
    <Modal show onHide={() => blocker.reset()} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('nav.withChanges.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {t('nav.withChanges.message')}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={() => blocker.reset()}>
          {t('nav.withChanges.no')}
        </Button>
        <Button variant="danger" onClick={() => blocker.proceed()}>
          {t('nav.withChanges.yes')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
