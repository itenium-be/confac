import {ButtonGroup as ReactButtonGroup} from 'react-bootstrap';
import {ProjectMonthProformaStatus} from '../models/ProjectMonthModel';
import {EnhanceWithClaim} from '../../enhancers/EnhanceWithClaim';
import {Claim} from '../../users/models/UserModel';
import {t} from '../../utils';
import {Button} from '../../controls/form-controls/Button';
import {EnhanceInputWithLabel} from '../../enhancers/EnhanceInputWithLabel';


type ProjectMonthProformaStatusSelectProps = {
  value: ProjectMonthProformaStatus;
  onChange: (status: ProjectMonthProformaStatus) => void;
}



const ButtonGroup = EnhanceWithClaim(ReactButtonGroup);


/** Switch between statusses for the Proforma invoice */
const ProjectMonthProformaStatusSelectComponent = ({value, onChange}: ProjectMonthProformaStatusSelectProps) => {
  const currentStatus = value;
  return (
    <ButtonGroup claim={Claim.ValidateProjectMonthInbound}>
      <Button
        key="new"
        variant={currentStatus === 'new' ? 'success' : 'outline-dark'}
        onClick={() => onChange('new')}
        title={t('projectMonth.ProformaNew')}
        icon="fa fa-inbox"
        className="tst-project-status-new"
      />
      <Button
        key="validated"
        variant={currentStatus === 'verified' ? 'success' : 'outline-dark'}
        onClick={() => onChange('verified')}
        title={t('projectMonth.ProformaVerified')}
        icon="fa fa-check"
        className="tst-project-status-verified"
      />
    </ButtonGroup>
  );
};

export const ProjectMonthProformaStatusSelect = EnhanceInputWithLabel(ProjectMonthProformaStatusSelectComponent);
