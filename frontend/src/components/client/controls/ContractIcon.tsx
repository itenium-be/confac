import React, { CSSProperties } from 'react';
import {Icon} from '../../controls/Icon';
import {IProjectModel} from '../../project/models/IProjectModel';
import {t} from '../../utils';
import {ClientModel} from '../models/ClientModels';
import {IContractModel, isFinalContractStatus} from '../models/ContractModels';

type ContractBadgeProps = {
  project?: IProjectModel;
  client?: ClientModel;
}

export const ContractIcons = ({project, client}: ContractBadgeProps) => {
  let frameworkAgreement = client?.frameworkAgreement.notes;
  if (frameworkAgreement) {
    frameworkAgreement = '<b>' + t('client.frameworkAgreement.title') + '</b><br><br' + frameworkAgreement;
  }

  let contract = project?.contract.notes;
  if (contract) {
    contract = '<b>' + t('project.contract.thisContract') + '</b><br><br' + contract;
  }

  return (
    <div style={{textAlign: 'center'}}>
      {client && <SingleContractIcon contract={client?.frameworkAgreement} tooltip={frameworkAgreement} style={{fontSize: 16}} />}
      {project && <SingleContractIcon contract={project?.contract} tooltip={contract} style={{fontSize: 16}} />}
    </div>
  );
};


type SingleContractBadgeProps = {
  contract?: IContractModel;
  contracts?: IContractModel[];
  style?: CSSProperties;
  tooltip?: string;
}

export const SingleContractIcon = ({contract, contracts, style, tooltip, ...props}: SingleContractBadgeProps) => {
  if (!contract && !contracts) {
    return null;
  }

  let ownStyle: {backgroundColor?: string, color: string};
  let fa: string;
  let globalTooltip: string;

  const ok = (contracts || []).concat([contract as IContractModel])
    .filter(x => !!x)
    .every(x => isFinalContractStatus(x.status));

  if (ok) {
    fa = 'fa fa-check';
    ownStyle = {color: 'green'};
    globalTooltip = 'contract.ok';
  } else {
    fa = 'fa fa-exclamation-triangle';
    ownStyle = {color: 'red'};
    globalTooltip = 'contract.nok';
  }

  return (
    <Icon
      fa={fa}
      style={{marginRight: 8, ...ownStyle, ...style}}
      title={tooltip || t(globalTooltip)}
      {...props}
    />
  );
}
