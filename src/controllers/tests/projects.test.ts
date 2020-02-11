/* eslint-disable max-len */
import {findActiveProjectsForSelectedMonth} from '../projects';
import {IProject} from '../../models/projects';

const initDate = (date: string) => new Date(date).toISOString();

const createProject = (start: string, end?: string): IProject => ({
  _id: '1',
  consultantId: 'c1',
  startDate: initDate(start),
  endDate: end && initDate(end),
  client: {
    clientId: 'client1',
    rateType: 'daily',
    tariff: 10,
  },
  projectMonthConfig: {
    timesheetCheck: true,
    inboundInvoice: false,
  },
});

describe('Feature: determine whether project is active or not', () => {
  it('should return true for a project with NO end date and a start date that comes BEFORE the selectedDate', () => {
    const selectedDate = initDate('2020-01-01');
    const initialProjects: IProject[] = [
      createProject('2019-11-28'),
    ];

    const result = findActiveProjectsForSelectedMonth(selectedDate, initialProjects);
    expect(result.length).toBe(1);
  });

  it('should return true for a project with NO end date and a start date that has the SAME month as the selectedDate', () => {
    const selectedDate = initDate('2020-01-01');
    const initialProjects: IProject[] = [
      createProject('2020-01-20'),
    ];

    const result = findActiveProjectsForSelectedMonth(selectedDate, initialProjects);

    expect(result.length).toBe(1);
  });

  it('should return false for a project with NO end date and a start date that has NOT the same month AND does not come before the selectedDate', () => {
    const selectedDate = initDate('2020-01-01');
    const initialProjects: IProject[] = [
      createProject('2020-02-20'),
    ];

    const result = findActiveProjectsForSelectedMonth(selectedDate, initialProjects);

    expect(result.length).toBe(0);
  });

  it('should return true for a project with a start date that comes BEFORE the selectedDate and an end date that comes AFTER the selectedDate', () => {
    const selectedDate = initDate('2020-01-01');
    const initialProjects: IProject[] = [
      createProject('2019-12-20', '2020-01-20'),
    ];

    const result = findActiveProjectsForSelectedMonth(selectedDate, initialProjects);

    expect(result.length).toBe(1);
  });

  it('should return false for a project with a start date that comes BEFORE the selectedDate and an end date that comes BEFORE the selectedDate', () => {
    const selectedDate = initDate('2020-01-01');
    const initialProjects: IProject[] = [
      createProject('2019-11-19', '2019-12-31'),
    ];

    const result = findActiveProjectsForSelectedMonth(selectedDate, initialProjects);

    expect(result.length).toBe(0);
  });

  it('should return true for a project with a start date that comes AFTER the selectedDate but has the SAME month and an end date that comes AFTER the selectedDate', () => {
    const selectedDate = initDate('2020-01-01');
    const initialProjects: IProject[] = [
      createProject('2020-01-20', '2020-03-19'),
    ];

    const result = findActiveProjectsForSelectedMonth(selectedDate, initialProjects);

    expect(result.length).toBe(1);
  });
});
