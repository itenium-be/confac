import {Error} from '../../../errors/error';

export interface DescriptionIsMandatoryForOderLinesWithTotalsError extends Error {
  Code: 'DescriptionIsMandatoryForOrderLinesWithTotals';
  Description: 'Description is mandatory for any orderline with totals.';
}
