// backend/src/__tests__/acornBox.test.ts
import request from 'supertest';
import app from '../app';
import { User, AcornBox } from '../models';

let token: string;

beforeEach(async () => {
  const user = await User.create({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  });

  const loginRes = await request(app)
    .post('/api/users/login')
    .send({
      email: 'test@example.com',
      password: 'password123'
    });

  token = loginRes.body.token;
});

describe('AcornBox API', () => {
  it('should create a new acorn box', async () => {
    const res = await request(app)
      .post('/api/acornboxes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Test acorn box',
        allowReplies: true
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('content', 'Test acorn box');
  });

  it('should get a random acorn box', async () => {
    await AcornBox.create({
      content: 'Test acorn box',
      author: '123456789012345678901234',
      anonymousId: 'anon123',
      status: 'available'
    });

    const res = await request(app)
      .get('/api/acornboxes/random')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('content');
  });

  it('should open an acorn box', async () => {
    const acornBox = await AcornBox.create({
      content: 'Test acorn box',
      author: '123456789012345678901234',
      anonymousId: 'anon123',
      status: 'available'
    });

    const res = await request(app)
      .post(`/api/acornboxes/${acornBox._id}/open`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'opened');
  });
});