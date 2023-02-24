import React from 'react';
import {ButtonGroup as ReactButtonGroup} from 'react-bootstrap';
import {ProjectMonthStatus} from '../models/ProjectMonthModel';
import {EnhanceWithClaim} from '../../enhancers/EnhanceWithClaim';
import {Claim} from '../../users/models/UserModel';
import {t} from '../../utils';
import {Button} from '../../controls/form-controls/Button';
import {EnhanceInputWithLabel} from '../../enhancers/EnhanceInputWithLabel';

type ProjectMonthStatusSelectProps = {
  value: ProjectMonthStatus;
  onChange: (status: ProjectMonthStatus) => void;
}



const ButtonGroup = EnhanceWithClaim(ReactButtonGroup);



const ProjectMonthStatusSelectComponent = ({value, onChange}: ProjectMonthStatusSelectProps) => {
  const currentStatus = value;
  return (
    <ButtonGroup claim={Claim.ValidateProjectMonth}>
      <Button
        key="false"
        variant={currentStatus === false ? 'success' : 'outline-dark'}
        onClick={() => onChange(false)}
        title={t('projectMonth.statusFalse')}
        icon="fa fa-ban"
      />
      <Button
        key="true"
        variant={currentStatus === true ? 'success' : 'outline-dark'}
        onClick={() => onChange(true)}
        title={t('projectMonth.statusTrue')}
        icon="fa fa-check"
      />
      <Button
        key="forced"
        variant={currentStatus === 'forced' ? 'success' : 'outline-dark'}
        onClick={() => onChange('forced')}
        title={t('projectMonth.forceVerified')}
        icon="fa fa-exclamation-triangle"
      />
    </ButtonGroup>
  );
};

export const ProjectMonthStatusSelect = EnhanceInputWithLabel(ProjectMonthStatusSelectComponent);
