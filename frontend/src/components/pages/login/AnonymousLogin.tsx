import React, { useState } from 'react';
import { StringInput } from '../../controls/form-controls/inputs/StringInput';
import { Button } from '../../controls/form-controls/Button';

type AnonymousLoginProps = {
  onLogin: (userName: string) => void;
};


/** Login page when google security is disabled */
export const AnonymousLogin = ({ onLogin }: AnonymousLoginProps) => {
  const [name, setName] = useState(localStorage.getItem('anonUser') || '');
  return (
    <>
      <h1>Zonder Login</h1>
      <StringInput label={'Jouw naam'} value={name} onChange={setName} />
      <Button className="btn btn-success tst-btn-login" onClick={() => { localStorage.setItem('anonUser', name); onLogin(name); }}>
        {'Confac Starten'}
      </Button>
    </>
  );
};
