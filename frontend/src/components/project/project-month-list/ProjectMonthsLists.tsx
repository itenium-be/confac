import React from 'react';
import {useSelector} from 'react-redux';
import {Container} from 'react-bootstrap';
import {ConfacState, ProjectMonthsListFilterOpenMonthsFormat} from '../../../reducers/app-state';
import {Features} from '../../controls/feature/feature-models';
import {useDocumentTitle} from '../../hooks/useDocumentTitle';
import { OpenOrClosedProjectMonthsList } from './OpenOrClosedProjectMonthsList';
import { ProjectMonthsListToolbar } from './ProjectMonthsListToolbar';


import './project-month-list.scss';


/** The monthly invoicing tables including the top searchbar */
export const ProjectMonthsLists = () => {
  useDocumentTitle('projectMonthsList');

  console.log('ProjectMonthsLists render');

  const projectMonths = useSelector((state: ConfacState) => state.projectsMonth);
  const uniqueMonths = projectMonths
    .map(projectMonth => projectMonth.month.format(ProjectMonthsListFilterOpenMonthsFormat))
    .filter((month, index, arr) => arr.indexOf(month) === index)
    .sort((a, b) => b.localeCompare(a));

  return (
    <Container className={`list list-${Features.projectMonths}`}>
      <ProjectMonthsListToolbar />
      {uniqueMonths.map(month => (
        <OpenOrClosedProjectMonthsList key={month} month={month} />
      ))}
    </Container>
  );
};
