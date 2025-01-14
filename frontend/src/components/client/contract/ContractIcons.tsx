import {IProjectModel} from '../../project/models/IProjectModel';
import {t} from '../../utils';
import {ClientModel} from '../models/ClientModels';
import { SingleContractIcon } from './SingleContractIcon';

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
