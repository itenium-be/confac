import moment from 'moment';
import { isDateIntervalValid, isProjectValid } from '../other/ProjectValidator';

describe('ProjectValidator is date inteval valid', () => {
  it('Should return true if start date is smaller then end date', () => {
    const startDate = moment('2024-01-01');
    const endDate = moment('2024-01-31');

    const res = isDateIntervalValid(startDate, endDate);

    expect(res).toBeTruthy();
  });

  it('Should return true if end date is undefined', () => {
    const startDate = moment('2024-01-01');
    const endDate = undefined;

    const res = isDateIntervalValid(startDate, endDate);

    expect(res).toBeTruthy();
  });

  it('Should return false if start date is bigger than end date', () => {
    const startDate = moment('2024-02-01');
    const endDate = moment('2024-01-31');

    const res = isDateIntervalValid(startDate, endDate);

    expect(res).toBeFalsy();
  });
});


describe('ProjectValidator is project valid', () => {
  it('Should return true if previous end date is smaller than new start date and end date is undefined', () => {
    const previousProjectEndDate = moment('2023-12-31');
    const startDate = moment('2024-01-01');
    const endDate = undefined;

    const res = isProjectValid(startDate, endDate, previousProjectEndDate);

    expect(res).toBeTruthy();
  });

  it('Should return true if previous end date is smaller than new start date and new end date is bigger than new start date', () => {
    const previousProjectEndDate = moment('2023-12-31');
    const startDate = moment('2024-01-01');
    const endDate = moment('2024-01-31');

    const res = isProjectValid(startDate, endDate, previousProjectEndDate);

    expect(res).toBeTruthy();
  });

  it('Should return false if previous end date is bigger than new start date', () => {
    const previousProjectEndDate = moment('2023-01-01');
    const startDate = moment('2022-12-31');
    const endDate = undefined;

    const res = isProjectValid(startDate, endDate, previousProjectEndDate);

    expect(res).toBeFalsy();
  });

  it('Should return false if new start date is bigger than new end date', () => {
    const previousProjectEndDate = moment('2023-01-01');
    const startDate = moment('2024-01-02');
    const endDate = moment('2023-01-01');

    const res = isProjectValid(startDate, endDate, previousProjectEndDate);

    expect(res).toBeFalsy();
  });
});
