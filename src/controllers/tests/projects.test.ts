import {findActiveProjectsForSelectedMonth} from '../projects';
import {IProject} from '../../models/projects';

const initDate = (date: string) => new Date(date).toISOString();

describe('Feature: determine whether project is active or not', () => {
  it('should return true for a project with NO end date and a start date that comes BEFORE the selectedDate', () => {
    const selectedDate = initDate('2020-01-01');
    const initialProjects: IProject[] = [
      {
        _id: '1',
        consultantId: 'c1',
        startDate: initDate('2019-11-28'),
        endDate: '',
        client: 'client1',
        clientTariff: 10,
        partner: '',
        partnerTariff: 0,
      },
    ];

    const expected: IProject[] = [
      {
        _id: '1',
        consultantId: 'c1',
        startDate: initDate('2019-11-28'),
        endDate: '',
        client: 'client1',
        clientTariff: 10,
        partner: '',
        partnerTariff: 0,
      },
    ];

    const result = findActiveProjectsForSelectedMonth(selectedDate, initialProjects);

    expect(result).toEqual(expected);
  });

  it('should return true for a project with NO end date and a start date that has the SAME month as the selectedDate', () => {
    const selectedDate = initDate('2020-01-01');
    const initialProjects: IProject[] = [
      {
        _id: '1',
        consultantId: 'c1',
        startDate: initDate('2020-01-20'),
        endDate: '',
        client: 'client1',
        clientTariff: 10,
        partner: '',
        partnerTariff: 0,
      },
    ];

    const expected: IProject[] = [
      {
        _id: '1',
        consultantId: 'c1',
        startDate: initDate('2020-01-20'),
        endDate: '',
        client: 'client1',
        clientTariff: 10,
        partner: '',
        partnerTariff: 0,
      },
    ];

    const result = findActiveProjectsForSelectedMonth(selectedDate, initialProjects);

    expect(result).toEqual(expected);
  });

  it('should return false for a project with NO end date and a start date that has NOT the same month AND does not come before the selectedDate', () => {
    const selectedDate = initDate('2020-01-01');
    const initialProjects: IProject[] = [
      {
        _id: '1',
        consultantId: 'c1',
        startDate: initDate('2020-02-20'),
        endDate: '',
        client: 'client1',
        clientTariff: 10,
        partner: '',
        partnerTariff: 0,
      },
    ];

    const expected: IProject[] = [];

    const result = findActiveProjectsForSelectedMonth(selectedDate, initialProjects);

    expect(result).toEqual(expected);
  });

  it('should return true for a project with a start date that comes BEFORE the selectedDate and an end date that comes AFTER the selectedDate', () => {
    const selectedDate = initDate('2020-01-01');
    const initialProjects: IProject[] = [
      {
        _id: '1',
        consultantId: 'c1',
        startDate: initDate('2019-12-20'),
        endDate: initDate('2020-01-20'),
        client: 'client1',
        clientTariff: 10,
        partner: '',
        partnerTariff: 0,
      },
    ];

    const expected: IProject[] = [
      {
        _id: '1',
        consultantId: 'c1',
        startDate: initDate('2019-12-20'),
        endDate: initDate('2020-01-20'),
        client: 'client1',
        clientTariff: 10,
        partner: '',
        partnerTariff: 0,
      },
    ];

    const result = findActiveProjectsForSelectedMonth(selectedDate, initialProjects);

    expect(result).toEqual(expected);
  });

  it('should return false for a project with a start date that comes BEFORE the selectedDate and an end date that comes BEFORE the selectedDate', () => {
    const selectedDate = initDate('2020-01-01');
    const initialProjects: IProject[] = [
      {
        _id: '1',
        consultantId: 'c1',
        startDate: initDate('2019-11-19'),
        endDate: initDate('2019-12-31'),
        client: 'client1',
        clientTariff: 10,
        partner: '',
        partnerTariff: 0,
      },
    ];

    const expected: IProject[] = [];

    const result = findActiveProjectsForSelectedMonth(selectedDate, initialProjects);

    expect(result).toEqual(expected);
  });

  it('should return true for a project with a start date that comes AFTER the selectedDate but has the SAME month and an end date that comes AFTER the selectedDate', () => {
    const selectedDate = initDate('2020-01-01');
    const initialProjects: IProject[] = [
      {
        _id: '1',
        consultantId: 'c1',
        startDate: initDate('2020-01-20'),
        endDate: initDate('2020-03-19'),
        client: 'client1',
        clientTariff: 10,
        partner: '',
        partnerTariff: 0,
      },
    ];

    const expected: IProject[] = [
      {
        _id: '1',
        consultantId: 'c1',
        startDate: initDate('2020-01-20'),
        endDate: initDate('2020-03-19'),
        client: 'client1',
        clientTariff: 10,
        partner: '',
        partnerTariff: 0,
      },
    ];

    const result = findActiveProjectsForSelectedMonth(selectedDate, initialProjects);

    expect(result).toEqual(expected);
  });
});
