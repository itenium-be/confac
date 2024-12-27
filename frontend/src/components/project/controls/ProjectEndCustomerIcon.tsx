import { useState } from "react";
import { ClientModal } from "../../client/controls/ClientModal";
import { ClientModel } from "../../client/models/ClientModels";
import { Icon, IconProps } from "../../controls/Icon";
import { ProjectEndCustomerModel } from "../models/IProjectModel";

type ProjectEndCustomerIconProps = IconProps & {
  endCustomer: ProjectEndCustomerModel | null | undefined;
  endCustomerClientModel: ClientModel | null | undefined;
};

export const ProjectEndCustomerIcon = ({
  endCustomer,
  endCustomerClientModel,
  ...props
}: ProjectEndCustomerIconProps) => {
  
  const [modal, setModal] = useState<boolean>(false);

  if (!endCustomer) {
    return null;
  }

  const title = [
      endCustomerClientModel?.name,
      endCustomer.contact,
      endCustomer.notes,
    ].filter(Boolean).join("<br/>");

  return (
    <div>
      <Icon
        fa="fa fa-user"
        size={1}
        title={title}
        {...props}
        onClick={() => setModal(true)}
      />
      {modal && endCustomerClientModel && (
        <ClientModal
          client={endCustomerClientModel}
          show={modal}
          onClose={() => {
            setModal(false);
          }}
        />
      )}
    </div>
  );
};
