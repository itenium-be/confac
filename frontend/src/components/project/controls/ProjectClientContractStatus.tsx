import React from 'react';
import {useSelector} from 'react-redux';
import {ConfacState} from '../../../reducers/app-state';
import {ContractBadge} from '../../client/contract/ContractBadge';
import {Button} from '../../controls/form-controls/Button';
import {NotesModalButton} from '../../controls/form-controls/button/NotesModalButton';
import {BaseInputProps} from '../../controls/form-controls/inputs/BaseInput';
import {EnhanceInputWithLabel} from '../../enhancers/EnhanceInputWithLabel';
import {Claim} from '../../users/models/UserModel';
import {t} from '../../utils';


/** Display Client Framework Agreement contract status from project.client.clientId */
const ProjectClientContractStatusComponent = ({value, ...props}: BaseInputProps<string>) => {
  const clientId = value;
  const client = useSelector((state: ConfacState) => state.clients.find(client => client._id === clientId));

  if (!client)
    return null;

  return (
    <div>
      <ContractBadge contract={client.frameworkAgreement} />

      {client.frameworkAgreement.notes && (
        <NotesModalButton
          value={client.frameworkAgreement.notes}
          onChange={val => {}}
          title={t('projectMonth.note')}
          style={{marginRight: 8, marginTop: -8}}
        />
      )}

      <Button className="tst-open-client" claim={Claim.ViewClients} variant="outline-dark" onClick={`/clients/${client.slug}`} style={{marginTop: -8}}>
        {t('project.goToClient')}
      </Button>
    </div>
  );
};

export const ProjectClientContractStatus = EnhanceInputWithLabel(ProjectClientContractStatusComponent);
