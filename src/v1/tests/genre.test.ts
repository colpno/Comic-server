import mongoose from 'mongoose';
import request from 'supertest';

import app from '../../app';
import { createEndpoint, CreateEndpointArgs } from './';

const getEndpoint = (args?: Omit<CreateEndpointArgs, 'baseEndpoint'>) => {
  return createEndpoint({ ...args, baseEndpoint: 'genres' });
};

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe('Genre', () => {
  it('should return a list of genres', async () => {
    const url = getEndpoint();

    const response = await request(app).get(url);
    const data = response.body.data;

    expect(response.status).toBe(200);
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
  });
});
