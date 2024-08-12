import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import supertest from 'supertest';
import app from '../app'; // 我们稍后会创建这个文件
import { UserModel } from '../models/User';

const request = supertest(app);

describe('User API', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  it('should create a new user', async () => {
    const res = await request.post('/api/users').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.username).toBe('testuser');
    expect(res.body.email).toBe('test@example.com');
    expect(res.body).not.toHaveProperty('password');
  });

  it('should get a user by id', async () => {
    const user = new UserModel({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    await user.save();

    const res = await request.get(`/api/users/${user._id}`);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('testuser');
    expect(res.body.email).toBe('test@example.com');
  });

  it('should update a user', async () => {
    const user = new UserModel({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    await user.save();

    const res = await request.put(`/api/users/${user._id}`).send({
      username: 'updateduser'
    });
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('updateduser');
  });

  it('should delete a user', async () => {
    const user = new UserModel({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    await user.save();

    const res = await request.delete(`/api/users/${user._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User deleted successfully');

    const deletedUser = await UserModel.findById(user._id);
    expect(deletedUser).toBeNull();
  });
});