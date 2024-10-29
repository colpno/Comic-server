import MongoDBStore from 'connect-mongodb-session';
import expressSession from 'express-session';
import { connect as connectToDB } from 'mongoose';

import { MONGODB_URI } from '../configs/database.conf';
import cookieConfig from '../v1/configs/cookie.conf';

export class MongoDB {
  async connect() {
    if (!MONGODB_URI) throw new Error('MongoDB URI is not defined');

    await connectToDB(MONGODB_URI);
  }
}

export class SessionStore {
  private store?: MongoDBStore.MongoDBStore;

  constructor(session: typeof expressSession) {
    if (!MONGODB_URI) throw new Error('MongoDB URI is not defined');

    const _MongoDBStore = MongoDBStore(session);

    this.store = new _MongoDBStore({
      uri: MONGODB_URI,
      collection: 'sessions',
      expires: cookieConfig.maxAge,
    });
  }

  getStore() {
    return this.store;
  }
}
