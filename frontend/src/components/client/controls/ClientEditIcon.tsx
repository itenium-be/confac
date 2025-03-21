import {IconProps, EditIcon} from '../../controls/Icon';
import {InvoiceClientModel} from '../models/ClientModels';

type ClientEditIconProps = IconProps & {
  client: InvoiceClientModel;
}

export const ClientEditIcon = ({client, ...props}: ClientEditIconProps) => {
  if (props.onClick) {
    return <EditIcon {...props} />;
  }
  return <EditIcon onClick={`/clients/${client.slug || client._id}`} {...props} />;
};
