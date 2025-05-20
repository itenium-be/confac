import {render} from '@testing-library/react';
import '@testing-library/jest-dom';
import {AuditLog, AuditModelTypes} from '../audit-models';
import {AuditChangeEntry} from '../AuditChangeEntry';


describe('AuditChangeEntry', () => {
  it.skip('AuditChangeEntry example test', () => {
    const change: AuditLog = {
      date: new Date(),
      modelId: '5',
      _id: '',
      user: '',
      model: 'client',
      diff: [],
    };
    const modelType: AuditModelTypes = 'client';
    render(<AuditChangeEntry change={change} modelType={modelType} />);
  });
});
