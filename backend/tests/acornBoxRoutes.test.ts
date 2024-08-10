import request from 'supertest';
import app, { closeServer } from '../src/app';
import { beforeAll, afterAll, describe, it, expect, jest, beforeEach } from '@jest/globals';
import { AcornBox, User } from '../src/models';
import dotenv from 'dotenv';

dotenv.config();

let token = '';

describe('AcornBox Routes', () => {
  beforeAll(async () => {
    await User.deleteMany({});
    await AcornBox.deleteMany({});
    await User.insertMany([
      {
        username: 'existuser',
        email: 'existuser@test.com',
        password: '$2b$10$yZsutY3OfXIbX88.cM7.cO1sGzLJUHVD5ppLSVbf3f/VLESOi2UYq',
      },
    ]);
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'existuser@test.com',
        password: 'password',
      })
    token = res.body.token;
  });
  afterAll(async () => {
    await User.deleteMany({});
    await AcornBox.deleteMany({});
    await closeServer();
  });
  describe('POST /api/acornboxes', () => {
    it('should create a new AcornBox', async () => {
      const response = await request(app)
        .post('/api/acornboxes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'Hello, world!',
          allowReplies: true,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('content', 'Hello, world!');
      expect(response.body).toHaveProperty('allowReplies', true);
    });

    it('should return 400 if input is invalid', async () => {
      const response = await request(app)
        .post('/api/acornboxes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: '',
          allowReplies: true,
        });

      expect(response.status).toBe(400);
    });

    it('should return 401 if unauthorized', async () => {
      const response = await request(app)
        .post('/api/acornboxes')
        .send({
          content: 'Hello, world!',
          allowReplies: true,
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/acornboxes/random', () => {
    it('should get a random AcornBox', async () => {
      const response = await request(app)
        .get('/api/acornboxes/random')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('content');
      expect(response.body).toHaveProperty('allowReplies');
    });

    it('should get empty collection if no available AcornBoxes', async () => {
      await AcornBox.deleteMany({});
      const response = await request(app)
        .get('/api/acornboxes/random')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No available acorn boxes');
    });

    it('should return 401 if unauthorized', async () => {
      const response = await request(app).get('/api/acornboxes/random');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/acornboxes/:id/open', () => {
    it('should open an AcornBox', async () => {
      const user = await User.findOne({});
      const inserted = await AcornBox.insertMany([{
        content: 'Hello, world!',
        author: user,
        anonymousId: '123',
      }]);
      const response = await request(app)
        .post(`/api/acornboxes/${inserted[0]._id}/open`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('content');
      expect(response.body.content).toBe('Hello, world!');
    });

    it('should return 400 if AcornBox is not available', async () => {
      const user = await User.findOne({});
      const inserted = await AcornBox.insertMany([{
        content: 'Hello, world!',
        status: 'opened',
        author: user,
        anonymousId: '23235',
      }]);
      const response = await request(app)
        .post(`/api/acornboxes/${inserted[0]._id}/open`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
    });

    it('should return 400 if AcornBox ID is invalid', async () => {
      const response = await request(app)
        .post('/api/acornboxes/123/open')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
    });

    it('should return 404 if AcornBox not found', async () => {
      const response = await request(app)
        .post('/api/acornboxes/66b6f7ddaafe5d370216ff17/open')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it('should return 401 if unauthorized', async () => {
      const response = await request(app).post('/api/acornboxes/123/open');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/acornboxes/user', () => {
    it('should get user\'s AcornBoxes', async () => {
      const response = await request(app)
        .get('/api/acornboxes/user')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('acornBoxes');
      expect(response.body).toHaveProperty('totalPages');
      expect(response.body).toHaveProperty('currentPage');
    });

    it('should return 401 if unauthorized', async () => {
      const response = await request(app).get('/api/acornboxes/user');

      expect(response.status).toBe(401);
    });
  });
});