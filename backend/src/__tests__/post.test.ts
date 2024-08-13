import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import supertest from 'supertest';
import app from '../app';
import { PostModel } from '../models/Post';
import { UserModel } from '../models/User';

const request = supertest(app);

describe('Post API', () => {
  let mongoServer: MongoMemoryServer;
  let testUser: any;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    testUser = new UserModel({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    await testUser.save();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await PostModel.deleteMany({});
  });

  it('should create a new post', async () => {
    const res = await request.post('/api/posts').send({
      content: 'Test post content',
      author: testUser._id
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.content).toBe('Test post content');
    expect(res.body.author).toBe(testUser._id.toString());
  });

  it('should get all posts', async () => {
    const post1 = new PostModel({
      content: 'Test post 1',
      author: testUser._id
    });
    await post1.save();

    const post2 = new PostModel({
      content: 'Test post 2',
      author: testUser._id
    });
    await post2.save();

    const res = await request.get('/api/posts');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].content).toBe('Test post 2'); // Assuming sorted by latest
    expect(res.body[1].content).toBe('Test post 1');
  });

  it('should get a post by id', async () => {
    const post = new PostModel({
      content: 'Test post content',
      author: testUser._id
    });
    await post.save();

    const res = await request.get(`/api/posts/${post._id}`);
    expect(res.status).toBe(200);
    expect(res.body.content).toBe('Test post content');
    expect(res.body.author).toBe(testUser._id.toString());
  });

  it('should update a post', async () => {
    const post = new PostModel({
      content: 'Original content',
      author: testUser._id
    });
    await post.save();

    const res = await request.put(`/api/posts/${post._id}`).send({
      content: 'Updated content'
    });
    expect(res.status).toBe(200);
    expect(res.body.content).toBe('Updated content');
  });

  it('should delete a post', async () => {
    const post = new PostModel({
      content: 'Test post content',
      author: testUser._id
    });
    await post.save();

    const res = await request.delete(`/api/posts/${post._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Post deleted successfully');

    const deletedPost = await PostModel.findById(post._id);
    expect(deletedPost).toBeNull();
  });

  it('should not create a post with empty content', async () => {
    const res = await request.post('/api/posts').send({
      content: '',
      author: testUser._id
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('content is required');
  });

  it('should not create a post with non-existent author', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request.post('/api/posts').send({
      content: 'Test content',
      author: fakeId
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('Invalid author');
  });

  it('should not update a non-existent post', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request.put(`/api/posts/${fakeId}`).send({
      content: 'Updated content'
    });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Post not found');
  });

  it('should not delete a non-existent post', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request.delete(`/api/posts/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Post not found');
  });
});