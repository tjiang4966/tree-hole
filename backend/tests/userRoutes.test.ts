import { beforeAll, afterAll, describe, it, expect, jest } from '@jest/globals';
import app, { closeServer } from '../src/app';
import request from 'supertest';
import { User } from '../src/models';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
  await User.deleteMany({});
  await User.insertMany([
    {
      username: 'existuser',
      email: 'existuser@test.com',
      password: '$2b$10$yZsutY3OfXIbX88.cM7.cO1sGzLJUHVD5ppLSVbf3f/VLESOi2UYq',
    },
  ]);
});

afterAll(async () => {
  await User.deleteMany({});
  await closeServer();
});

describe('User Routes', () => {
  describe('POST /user/register', () => {
    const testCases = [
      {
        name: 'should return 400 if user already exists',
        input: {
          username: 'existuser',
          email: 'existuser@test.com',
          password: 'password',
        },
        existingUser: true,
        expectedStatus: 400,
        expectedResponse: { message: 'Username or email already exists' },
      },
      {
        name: 'should return 201 if user registration is successful',
        input: {
          username: 'test',
          email: 'test@test.com',
          password: 'password',
        },
        existingUser: false,
        expectedStatus: 201,
        expectedResponse: expect.objectContaining({
          token: expect.any(String),
          user: expect.objectContaining({
            id: expect.any(String),
            username: 'test',
            email: 'test@test.com',
          }),
        }),
      },
    ];

    testCases.forEach((tc) => {
      it(tc.name, async () => {
        const res = await request(app)
          .post('/api/users/register')
          .send(tc.input);

        expect(res.status).toEqual(tc.expectedStatus);
        expect(res.body).toEqual(tc.expectedResponse);
      });
    });
  });

  describe('POST /user/login', () => {
    const testCases = [
      {
        name: 'should return 200 if login is successful',
        input: {
          email: 'existuser@test.com',
          password: 'password',
        },
        expectedStatus: 200,
        expectedResponse: expect.objectContaining({
          token: expect.any(String),
          user: expect.objectContaining({
            id: expect.any(String),
            username: 'existuser',
            email: 'existuser@test.com',
          }),
        }),
      },
      {
        name: 'should return 400 if login credentials are invalid',
        input: {
          email: 'nonexistentuser@test.com',
          password: 'password',
        },
        expectedStatus: 400,
        expectedResponse: { message: 'Invalid credentials' },
      },
    ];

    testCases.forEach((tc) => {
      it(tc.name, async () => {
        const res = await request(app)
          .post('/api/users/login')
          .send(tc.input);

        expect(res.status).toEqual(tc.expectedStatus);
        expect(res.body).toEqual(tc.expectedResponse);
      });
    });
  });

  describe('GET /user/profile', () => {
    it('should return 401 if user is not authenticated', async () => {
      const res = await request(app).get('/api/users/profile');

      expect(res.status).toEqual(401);
      expect(res.body).toEqual({ error: 'Please authenticate.' });
    });

    it('should return 200 if user profile is retrieved successfully', async () => {
      const user = await User.create({
        username: 'testuser',
        email: 'testuser@test.com',
        password: await bcrypt.hash('password', 10),
      });

      // login user
      const loginRes = await request(app)
        .post('/api/users/login')
        .send({ email: 'testuser@test.com', password: 'password' });
      
      const token = loginRes.body.token;

      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toEqual(200);
      expect(res.body).toEqual(expect.objectContaining({
        _id: user.id,
        username: 'testuser',
        email: 'testuser@test.com',
      }));
    });
  });
});