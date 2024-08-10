import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';
import app, { closeServer } from '../src/app';
import request from 'supertest';
import { User, Reply, AcornBox } from '../src/models';
import dotenv from 'dotenv';
import { beforeEach } from 'node:test';
import { MergeType } from 'mongoose';
import { IAcornBox } from '../src/models/AcornBox';
import { IReply } from '../src/models/Reply';
import { IUser } from '../src/models/User';

dotenv.config();

let acornBoxes: any[];
let replies: any[];
let users: any[];
let readerToken: string;
let authorToken: string;

beforeAll(async () => {
  await User.deleteMany({});
  await AcornBox.deleteMany({});
  await Reply.deleteMany({});
  users = await User.insertMany([
    {
      username: 'author',
      email: 'author@test.com',
      password: '$2b$10$yZsutY3OfXIbX88.cM7.cO1sGzLJUHVD5ppLSVbf3f/VLESOi2UYq',
    },
    {
      username: 'reader',
      email: 'reader@test.com',
      password: '$2b$10$yZsutY3OfXIbX88.cM7.cO1sGzLJUHVD5ppLSVbf3f/VLESOi2UYq',
    }
  ]);
  acornBoxes = await AcornBox.insertMany([
    {
      content: 'AB1',
      allowReplies: true,
      author: users[0],
      anonymousId: '1234567890',
    },
    {
      content: 'AB2',
      allowReplies: true,
      author: users[0],
      anonymousId: '123456789',
    },
    {
      content: 'AB3',
      allowReplies: true,
      author: users[1],
      anonymousId: '12345678',
    },
  ]);
  replies = await Reply.insertMany([
    {
      content: 'R1AB1',
      acornBox: acornBoxes[0],
      author: users[1],
    },
    {
      content: 'R2AB2',
      acornBox: acornBoxes[1],
      author: users[1],
    },
    {
      content: 'R3AB3',
      acornBox: acornBoxes[2],
      author: users[0],
    },
    {
      content: 'R4AB3',
      acornBox: acornBoxes[2],
      author: users[0],
    }
  ]),

  readerToken = (await request(app).post('/api/users/login').send({
    email: 'reader@test.com',
    password: 'password',
  })).body.token;

  authorToken = (await request(app).post('/api/users/login').send({
    email: 'author@test.com',
    password: 'password',
  })).body.token;
});

afterAll(async () => {
  await User.deleteMany({});
  await AcornBox.deleteMany({});
  await Reply.deleteMany({});
  await closeServer();
});

describe('Reply Routes', () => {
  describe('POST /replies', () => {
    it('should return 401 if user is not authenticated', async () => {
      const res = await request(app).post('/api/replies').send({
        content: 'This is a reply',
        acornBoxId: '1234567890',
      });

      expect(res.status).toEqual(401);
      expect(res.body).toEqual({ error: 'Please authenticate.' });
    });
    it('should return 400 if reply is not valid', async () => {
      const res = await request(app)
        .post('/api/replies')
        .set('Authorization', `Bearer ${readerToken}`)
        .send({
          acornBoxId: acornBoxes[0]._id,
        });
      expect(res.status).toEqual(400);
    });
    it('should return 201 if reply is created successfully', async () => {
      const res = await request(app)
        .post('/api/replies')
        .set('Authorization', `Bearer ${readerToken}`)
        .send({
          content: 'This is a reply',
          acornBoxId: acornBoxes[0]._id,
        });
      expect(res.status).toEqual(201);
      expect(res.body.author).toEqual(users[1]._id.toString());
      expect(res.body.content).toEqual('This is a reply');
      expect(res.body.acornBox).toEqual(acornBoxes[0]._id.toString());
    });
  });

  describe('GET /replies', () => {
    it('should return 401 if user is not authenticated', async () => {
      const res = await request(app).get('/api/replies');
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({ error: 'Please authenticate.' });
    });
    it('should return replies if user is authenticated', async () => {
      const res = await request(app)
        .get(`/api/replies`)
        .set('Authorization', `Bearer ${readerToken}`);
      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(3);
      (res.body as Array<any>).forEach((element) => {
        expect([
          replies[2]._id.toString(),
          replies[3]._id.toString(),
        ].includes(element._id)).toBeFalsy();
      });
    });
  });

  describe('GET /replies/received', () => {
    it('should return 401 if user is not authenticated', async () => {
      const res = await request(app).get('/api/replies/received');
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({ error: 'Please authenticate.' });
    });
    it('should return replies if user is authenticated', async () => {
      const res = await request(app)
        .get(`/api/replies/received`)
        .set('Authorization', `Bearer ${authorToken}`);
      expect(res.status).toEqual(200);
      (res.body.replies as Array<any>).forEach((element) => {
        expect([
          replies[2]._id.toString(),
          replies[3]._id.toString(),
        ].includes(element._id)).toBeFalsy();
      });
    });
  });
});