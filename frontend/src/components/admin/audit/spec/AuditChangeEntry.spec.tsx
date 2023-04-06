import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import { AuditChange, AuditLog, AuditModelTypes } from '../audit-models';
import { AuditChangeEntry } from '../AuditChangeEntry';


describe('AuditChangeEntry', () => {
  it('', () => {
    const change: AuditLog = {
      date: new Date(),
      modelId: '5',
      _id: '',
      user: '',
      model: 'client',
      diff: [],
    };
    const modelType: AuditModelTypes = 'client'
    const rendered = render(<AuditChangeEntry change={change} modelType={modelType} />)
  })

  it('', () => {})
})
