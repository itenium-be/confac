import React from 'react';
import {Container} from 'react-bootstrap';
import {t} from '../utils';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import {Button} from '../controls/form-controls/Button';


export const EditAdmin = () => {
  useDocumentTitle('admin');

  return (
    <Container className="edit-container">
      <h1>{t('admin.title')}</h1>
      <Button variant="light" onClick="/users">{t('admin.users')}</Button>
    </Container>
  );
};
