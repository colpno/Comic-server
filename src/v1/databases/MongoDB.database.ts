import { connect as connectToDB } from 'mongoose';

import { MONGODB_URI } from '../configs/database.conf';
import { Error404 } from '../utils/error.utils';

export default class MongoDB {
  async connect() {
    if (!MONGODB_URI) throw new Error404('MongoDB URI is not defined');

    await connectToDB(MONGODB_URI);
  }
}
