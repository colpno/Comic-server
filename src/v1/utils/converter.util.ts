import moment, { DurationInputArg2 } from 'moment';
import { Types } from 'mongoose';

export const toMS = (duration: number, unit: DurationInputArg2) =>
  moment.duration(duration, unit).asMilliseconds();

export const toObjectId = (id: string) => new Types.ObjectId(id);
