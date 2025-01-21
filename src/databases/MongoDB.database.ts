import { connect as connectToDB } from 'mongoose';

import { MONGODB_URI } from '../configs/database.conf';

export default class MongoDB {
  async connect() {
    if (!MONGODB_URI) throw new Error('MongoDB URI is not defined');

    await connectToDB(MONGODB_URI);
  }
}
