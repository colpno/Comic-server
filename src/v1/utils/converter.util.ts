import moment, { DurationInputArg2 } from 'moment';
import { Types } from 'mongoose';
import { HOST_URL } from '../../configs/app.conf';

export const toMS = (duration: number, unit: DurationInputArg2) =>
  moment.duration(duration, unit).asMilliseconds();

export const toObjectId = (id: string) => new Types.ObjectId(id);

export const toProxyUrl = (proxyUrl: string) => `${HOST_URL}/proxy/${encodeURIComponent(proxyUrl)}`;
