import {Moment} from "moment";

export const isDateIntervalValid = (startDate: Moment, endDate: Moment) => {
    return startDate.diff(endDate) < 0;
};

export const isProjectExtensionDateValid = (previousProjectEndDate: Moment, newProjectStartDate: Moment) => {
    return previousProjectEndDate.diff(newProjectStartDate) < 0;
}