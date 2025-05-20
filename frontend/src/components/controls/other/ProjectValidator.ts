import {Moment} from "moment";

export const isDateIntervalValid = (startDate: Moment, endDate: Moment | undefined): boolean => {
  if (!endDate) {
    return true;
  }
  return startDate.diff(endDate) < 0;
};

export const isProjectValid = (startDate: Moment, endDate: Moment | undefined, previousProjectEndDate: Moment):boolean => {
  const intervalValid = isDateIntervalValid(startDate, endDate);
  const projectValid = isDateIntervalValid(previousProjectEndDate, startDate);
  return intervalValid && projectValid;
};
