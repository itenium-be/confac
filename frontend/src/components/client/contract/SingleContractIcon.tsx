import {CSSProperties} from 'react';
import {Icon} from '../../controls/Icon';
import {t} from '../../utils';
import {IContractModel, isFinalContractStatus} from '../models/ContractModels';

type SingleContractBadgeProps = {
  contract?: IContractModel;
  contracts?: IContractModel[];
  style?: CSSProperties;
  tooltip?: string;
};

export const SingleContractIcon = ({contract, contracts, style, tooltip, ...props}: SingleContractBadgeProps) => {
  if (!contract && !contracts) {
    return null;
  }

  let ownStyle: { backgroundColor?: string; color: string };
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
      className={ok ? 'tst-contract-ok' : 'tst-contract-nok'}
      fa={fa}
      style={{marginRight: 8, ...ownStyle, ...style}}
      title={tooltip || t(globalTooltip)}
      {...props}
    />
  );
};
