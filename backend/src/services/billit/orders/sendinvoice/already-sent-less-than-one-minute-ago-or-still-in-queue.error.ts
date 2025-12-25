import {Error} from '../../errors/error';

export interface AlreadySentLessThanOneMinuteAgoOrStillInQueueError extends Error {
  Code: 'This_0_WasAlreadySentLessThen_1_MinutesAgoTo_2_OrIsStillInTheQueue';
}
