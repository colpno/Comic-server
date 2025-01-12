import moment, { DurationInputArg2 } from 'moment';

export const toMS = (duration: number, unit: DurationInputArg2) =>
  moment.duration(duration, unit).asMilliseconds();
