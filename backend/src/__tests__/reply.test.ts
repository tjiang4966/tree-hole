// backend/src/__tests__/reply.test.ts
import request from 'supertest';
import app from '../app';
import { User, AcornBox } from '../models';

let token: string;
let acornBoxId: string;

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

  const acornBox = await AcornBox.create({
    content: 'Test acorn box',
    author: user._id,
    anonymousId: 'anon123',
    status: 'opened',
    allowReplies: true
  });

  acornBoxId = acornBox._id.toString();
});

describe('Reply API', () => {
  it('should create a new reply', async () => {
    const res = await request(app)
      .post('/api/replies')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Test reply',
        acornBoxId
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('content', 'Test reply');
  });

  it('should get user replies', async () => {
    await request(app)
      .post('/api/replies')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Test reply',
        acornBoxId
      });

    const res = await request(app)
      .get('/api/replies')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.replies.length).toBe(1);
    expect(res.body.replies[0]).toHaveProperty('content', 'Test reply');
  });
});