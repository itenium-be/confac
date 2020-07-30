import React from 'react';
import {Link, LinkProps} from '../../controls/Link';
import {t} from '../../utils';
import {ProjectMonthModel} from '../models/ProjectMonthModel';


type ProjectMonthLinkProps = Omit<Omit<LinkProps, 'to'>, 'label'> & {
  to: ProjectMonthModel;
  label?: string;
}


export const ProjectMonthLink = ({to, label, ...props}: ProjectMonthLinkProps) => {
  return (
    <Link
      to={`/projects/${to.month.format('YYYY-MM')}/${to._id}`}
      label={label || t('projectMonth.linkLabel')}
      {...props}
    />
  );
};
