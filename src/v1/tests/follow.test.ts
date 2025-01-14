import mongoose from 'mongoose';
import request from 'supertest';

import app from '../../app';
import { AddFollowBody } from '../controllers/follow.controller';
import { createEndpoint, CreateEndpointArgs, login } from './';

const getEndpoint = (args?: Omit<CreateEndpointArgs, 'baseEndpoint'>) => {
  return createEndpoint({ ...args, baseEndpoint: 'follows' });
};

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe('Follows', () => {
  let csrfToken: string, csrfTokenCookie: string[], authCookies: string[];

  beforeAll(async () => {
    const response = await login();
    csrfToken = response.csrfToken;
    csrfTokenCookie = response.csrfTokenCookie;
    authCookies = response.authCookies;

    console.log('file: follow.test.ts:36 ~ authCookies:', authCookies);
    console.log('file: follow.test.ts:36 ~ csrfTokenCookie:', csrfTokenCookie);
    console.log('file: follow.test.ts:36 ~ csrfToken:', csrfToken);
  });

  it('should return a list of at most 100 following', async () => {
    const url = getEndpoint();

    const response = await request(app).get(url).set('Cookie', authCookies);

    expect(response.status).toBe(200);
  });

  it('should return 200 for adding to existing', async () => {
    const url = getEndpoint();
    const body: AddFollowBody & { follower: string } = {
      follower: '677bc194168fabfa6afc3ed0',
      followingId: 'test',
    };
    const cookies = [...csrfTokenCookie, ...authCookies];

    const response = await request(app)
      .get(url)
      .set('Cookie', cookies)
      .set('X-CSRF-Token', csrfToken)
      .send(body);

    expect(response.status).toBe(200);
  });

  // it('should return 201 for initially creating', async () => {
  //   const url = getEndpoint();
  //   const body: AddFollowBody = {
  //     follower: '677bc194168fabfa6afc3ed0',
  //     following: 'test',
  //   };
  //   const cookies = [...csrfTokenCookie, ...authCookies];

  //   const response = await request(app)
  //     .get(url)
  //     .set('Cookie', cookies)
  //     .set('X-CSRF-Token', csrfToken)
  //     .send(body);

  //   expect(response.status).toBe(200);
  // });

  it('should return 200 for deleting a follow', async () => {
    const idToRemove = 'test';
    const url = getEndpoint({ extends: `/${idToRemove}` });
    const cookies = [...csrfTokenCookie, ...authCookies];

    const response = await request(app)
      .get(url)
      .set('Cookie', cookies)
      .set('X-CSRF-Token', csrfToken);

    expect(response.status).toBe(200);
  });
});
