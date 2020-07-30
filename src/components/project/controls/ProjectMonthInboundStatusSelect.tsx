import React from 'react';
import {ButtonGroup as ReactButtonGroup} from 'react-bootstrap';
import {ProjectMonthInboundStatus} from '../models/ProjectMonthModel';
import {EnhanceWithClaim} from '../../enhancers/EnhanceWithClaim';
import {Claim} from '../../users/models/UserModel';
import {t} from '../../utils';
import {Button} from '../../controls/form-controls/Button';

type ProjectMonthInboundStatusSelectProps = {
  value: ProjectMonthInboundStatus;
  onChange: (status: ProjectMonthInboundStatus) => void;
}



const ButtonGroup = EnhanceWithClaim(ReactButtonGroup);


/** Switch between statusses for the inbound invoice */
export const ProjectMonthInboundStatusSelect = ({value, onChange}: ProjectMonthInboundStatusSelectProps) => {
  const currentStatus = value;
  return (
    <ButtonGroup claim={Claim.ValidateProjectMonth}>
      <Button
        key="new"
        variant={currentStatus === 'new' ? 'success' : 'outline-dark'}
        onClick={() => onChange('new')}
        title={t('projectMonth.inboundNew')}
        icon="fa fa-inbox"
      />
      <Button
        key="validated"
        variant={currentStatus === 'validated' ? 'success' : 'outline-dark'}
        onClick={() => onChange('validated')}
        title={t('projectMonth.inboundValidated')}
        icon="fa fa-check"
      />
      <Button
        key="paid"
        variant={currentStatus === 'paid' ? 'success' : 'outline-dark'}
        onClick={() => onChange('paid')}
        title={t('projectMonth.inboundPaid')}
        icon="fa fa-coins"
      />
    </ButtonGroup>
  );
};
