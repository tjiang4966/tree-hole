import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import supertest from 'supertest';
import app from '../app'; // 确保你有一个 app.ts 文件导出 Express app
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

  it('should not create a user with duplicate username', async () => {
    await request.post('/api/users').send({
      username: 'testuser',
      email: 'test1@example.com',
      password: 'password123'
    });

    const res = await request.post('/api/users').send({
      username: 'testuser',
      email: 'test2@example.com',
      password: 'password123'
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('duplicate key error');
  });

  it('should not create a user with duplicate email', async () => {
    await request.post('/api/users').send({
      username: 'testuser1',
      email: 'test@example.com',
      password: 'password123'
    });

    const res = await request.post('/api/users').send({
      username: 'testuser2',
      email: 'test@example.com',
      password: 'password123'
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('duplicate key error');
  });

  it('should not create a user with invalid email format', async () => {
    const res = await request.post('/api/users').send({
      username: 'testuser',
      email: 'invalid-email',
      password: 'password123'
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('invalid email');
  });

  it('should not update a non-existent user', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request.put(`/api/users/${fakeId}`).send({
      username: 'updateduser'
    });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('User not found');
  });

  it('should not delete a non-existent user', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request.delete(`/api/users/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('User not found');
  });
});