import React from 'react';
import {IconProps, EditIcon} from '../../controls/Icon';
import {ClientModel} from '../models/ClientModels';

type ClientEditIconProps = IconProps & {
  client: ClientModel;
}

export const ClientEditIcon = ({client, ...props}: ClientEditIconProps) => {
  if (props.onClick) {
    return <EditIcon {...props} />;
  }
  return <EditIcon onClick={`/clients/${client.slug || client._id}`} {...props} />;
};
