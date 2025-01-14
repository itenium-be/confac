import {CSSProperties} from 'react';
import {ButtonGroup as ReactButtonGroup} from 'react-bootstrap';
import {ProjectMonthInboundStatus} from '../models/ProjectMonthModel';
import {EnhanceWithClaim} from '../../enhancers/EnhanceWithClaim';
import {Claim} from '../../users/models/UserModel';
import {t} from '../../utils';
import {Button} from '../../controls/form-controls/Button';
import {EnhanceInputWithLabel} from '../../enhancers/EnhanceInputWithLabel';


type ProjectMonthInboundStatusSelectProps = {
  value: ProjectMonthInboundStatus;
  onChange: (status: ProjectMonthInboundStatus) => void;
  style?: CSSProperties;
}



const ButtonGroup = EnhanceWithClaim(ReactButtonGroup);


/** Switch between statusses for the inbound invoice */
const ProjectMonthInboundStatusSelectComponent = ({value, onChange, style}: ProjectMonthInboundStatusSelectProps) => {
  const currentStatus = value;
  const btnGroup = (
    <ButtonGroup claim={Claim.ValidateProjectMonthInbound}>
      <Button
        key="new"
        variant={currentStatus === 'new' ? 'success' : 'outline-dark'}
        onClick={() => onChange('new')}
        title={t('projectMonth.inboundNew')}
        icon="fa fa-inbox"
        className="tst-project-status-new"
      />
      <Button
        key="validated"
        variant={currentStatus === 'validated' ? 'success' : 'outline-dark'}
        onClick={() => onChange('validated')}
        title={t('projectMonth.inboundValidated')}
        icon="fa fa-check"
        className="tst-project-status-validated"
      />
      <Button
        key="paid"
        variant={currentStatus === 'paid' ? 'success' : 'outline-dark'}
        onClick={() => onChange('paid')}
        title={t('projectMonth.inboundPaid')}
        icon="fa fa-coins"
        className="tst-project-status-paid"
      />
    </ButtonGroup>
  );

  if (style) {
    return (
      <div style={style}>
        {btnGroup}
      </div>
    )
  }

  return btnGroup;
};

export const ProjectMonthInboundStatusSelect = EnhanceInputWithLabel(ProjectMonthInboundStatusSelectComponent);
