// import moment from 'moment';
// import {findActiveProjectsBySelectedDate} from '../src/resources/projects';

// // moment's default format: YYYY-MM-DDTHH:mm:ssZ

// const initDate = date => moment(new Date(date));

// const projects = [
//   {_id: '1', consultantId: 'c1', startDate: initDate('2019-11-28'), endDate: initDate('2020-01-30'), client: 'client1', clientTariff: 10, partner: '', partnerTariff: 0},
//   {_id: '2', consultantId: 'c2', startDate: initDate('2020-01-20'), endDate: '', client: 'client2', clientTariff: 20, partner: '', partnerTariff: 0},
//   {_id: '3', consultantId: 'c3', startDate: initDate('2019-11-30'), endDate: initDate('2020-02-20'), client: 'client3', clientTariff: 30, partner: '', partnerTariff: 0},
//   {_id: '4', consultantId: 'c4', startDate: initDate('2020-02-01'), endDate: '', client: 'client5', clientTariff: 50, partner: '', partnerTariff: 0},
//   {_id: '5', consultantId: 'c5', startDate: initDate('2019-02-01'), endDate: '', client: 'client5', clientTariff: 50, partner: '', partnerTariff: 0},
//   {_id: '6', consultantId: 'c6', startDate: initDate('2020-01-02'), endDate: '', client: 'client5', clientTariff: 50, partner: '', partnerTariff: 0},
//   {_id: '7', consultantId: 'c7', startDate: initDate('2020-01-02'), endDate: initDate('2020-01-30'), client: 'client5', clientTariff: 50, partner: '', partnerTariff: 0},
//   {_id: '8', consultantId: 'c8', startDate: initDate('2020-01-02'), endDate: initDate('2020-04-30'), client: 'client5', clientTariff: 50, partner: '', partnerTariff: 0},
// ];

// describe('Feature: add active projects to a selected month ', () => {
//   it('should return projects that match the selected month January 2020', () => {
//     const selectedDate = initDate('2020-01-01');
//     const expected = [
//       {_id: '1', consultantId: 'c1', startDate: initDate('2019-11-28'), endDate: initDate('2020-01-30'), client: 'client1', clientTariff: 10, partner: '', partnerTariff: 0},
//       {_id: '2', consultantId: 'c2', startDate: initDate('2020-01-20'), endDate: '', client: 'client2', clientTariff: 20, partner: '', partnerTariff: 0},
//       {_id: '3', consultantId: 'c3', startDate: initDate('2019-11-30'), endDate: initDate('2020-02-20'), client: 'client3', clientTariff: 30, partner: '', partnerTariff: 0},
//       {_id: '5', consultantId: 'c5', startDate: initDate('2019-02-01'), endDate: '', client: 'client5', clientTariff: 50, partner: '', partnerTariff: 0},
//       {_id: '6', consultantId: 'c6', startDate: initDate('2020-01-02'), endDate: '', client: 'client5', clientTariff: 50, partner: '', partnerTariff: 0},
//       {_id: '7', consultantId: 'c7', startDate: initDate('2020-01-02'), endDate: initDate('2020-01-30'), client: 'client5', clientTariff: 50, partner: '', partnerTariff: 0},
//       {_id: '8', consultantId: 'c8', startDate: initDate('2020-01-02'), endDate: initDate('2020-04-30'), client: 'client5', clientTariff: 50, partner: '', partnerTariff: 0},
//     ];

//     const result = findActiveProjectsBySelectedDate(selectedDate, projects);

//     expect(result).toEqual(expected);
//   });
// });
