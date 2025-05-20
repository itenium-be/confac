import {Badge} from 'react-bootstrap';
import {t} from '../../utils';
import {ContractStatus, IContractModel} from '../models/ContractModels';


type ContractBadgeProps = {
  contract: IContractModel;
}

const defaultBadgeStyle = {fontSize: '130%', fontWeight: 300};

type BadgeStyle = {bg: string; text: string};

function getBadgeStyle(status: ContractStatus): BadgeStyle {
  switch (status) {
    case ContractStatus.NotNeeded:
    case ContractStatus.BothSigned:
      return {bg: 'success', text: 'white'};

    case ContractStatus.TheySigned:
    case ContractStatus.WeSigned:
      return {bg: 'warning', text: 'white'};

    case ContractStatus.Sent:
    case ContractStatus.Verified:
    case ContractStatus.NoContract:
      return {bg: 'danger', text: 'white'};

    default:
      console.error(`Unexpected ContractStatus '${status}'`);
      return {bg: 'danger', text: 'white'};
  }
}


export const ContractBadge = ({contract}: ContractBadgeProps) => {
  if (!contract) {
    return null;
  }

  const badgeStyle = getBadgeStyle(contract.status);
  return (
    <Badge style={{...defaultBadgeStyle, marginRight: 8}} bg={badgeStyle.bg} text={badgeStyle.text}>
      {t(`contract.status.${contract.status}`)}
    </Badge>
  );
};
