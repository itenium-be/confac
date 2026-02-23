import {t} from '../../../utils';
import {Button} from '../Button';
import {Claim} from '../../../users/models/UserModel';


/** Props to be used as FormConfig/ArrayInput */
export type SelectWithCreateModalProps<TModel> = {
  value?: string | TModel;
  onChange: (modelId: string, model: TModel) => void;
}



type SelectWithCreateButtonProps = {
  children: any;
  openCreateModal: () => void;
  createButtonText: string;
  claim: Claim;
}


export const SelectWithCreateButton = ({claim, children, openCreateModal, createButtonText}: SelectWithCreateButtonProps) => (
  <div className="unset-split">
    <div>
      {children}
    </div>
    <div style={{width: 120, position: 'relative'}}>
      <Button
        className="tst-create"
        claim={{claim, or: 'disabled'}}
        onClick={openCreateModal}
        variant="light"
        size="sm"
        style={{position: 'absolute', bottom: 18, left: 5, width: '100%'}}
      >
        {t(createButtonText)}
      </Button>
    </div>
  </div>
);
