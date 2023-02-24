import React from 'react';
import {Spinner} from 'react-bootstrap';
import {t} from '../utils';

import './LoadingPage.scss';

export const LoadingPage = () => (
  <div className="container">
    <div className="row loading-page">
      <Spinner animation="border" role="status" variant="primary">
        <span className="sr-only">Loading...</span>
      </Spinner>
      <h2>{t('loadingApp')}</h2>
    </div>
  </div>
);
