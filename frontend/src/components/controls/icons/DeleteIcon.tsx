import {IconProps, Icon} from '../Icon';
import {t} from '../../utils';
import {EnhanceWithConfirmation} from '../../enhancers/EnhanceWithConfirmation';

export const DeleteIcon = ({...props}: IconProps) => (
  <Icon className="tst-delete" fa="fa fa-trash" size={props.size || 2} color="#CC1100" title={t('delete')} {...props} />
);

export const ConfirmedDeleteIcon = EnhanceWithConfirmation(DeleteIcon);
