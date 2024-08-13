import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import supertest from 'supertest';
import app from '../app';
import { CommentModel } from '../models/Comment';
import { PostModel } from '../models/Post';
import { UserModel } from '../models/User';

const request = supertest(app);

describe('Comment API', () => {
  let mongoServer: MongoMemoryServer;
  let testUser: any;
  let testPost: any;

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

    testPost = new PostModel({
      content: 'Test post content',
      author: testUser._id
    });
    await testPost.save();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await CommentModel.deleteMany({});
  });

  it('should create a new comment', async () => {
    const res = await request.post('/api/comments').send({
      content: 'Test comment content',
      author: testUser._id,
      post: testPost._id
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.content).toBe('Test comment content');
    expect(res.body.author).toBe(testUser._id.toString());
    expect(res.body.post).toBe(testPost._id.toString());

    const updatedPost = await PostModel.findById(testPost._id);
    expect(updatedPost?.comments).toBe(1);
  });

  it('should get a comment by id', async () => {
    const comment = new CommentModel({
      content: 'Test comment content',
      author: testUser._id,
      post: testPost._id
    });
    await comment.save();

    const res = await request.get(`/api/comments/${comment._id}`);
    expect(res.status).toBe(200);
    expect(res.body.content).toBe('Test comment content');
    expect(res.body.author).toBe(testUser._id.toString());
  });

  it('should update a comment', async () => {
    const comment = new CommentModel({
      content: 'Original content',
      author: testUser._id,
      post: testPost._id
    });
    await comment.save();

    const res = await request.put(`/api/comments/${comment._id}`).send({
      content: 'Updated content'
    });
    expect(res.status).toBe(200);
    expect(res.body.content).toBe('Updated content');
  });

  it('should delete a comment', async () => {
    const comment = new CommentModel({
      content: 'Test comment content',
      author: testUser._id,
      post: testPost._id
    });
    await comment.save();

    await PostModel.findByIdAndUpdate(testPost._id, { $inc: { comments: 1 } });

    const res = await request.delete(`/api/comments/${comment._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Comment deleted successfully');

    const deletedComment = await CommentModel.findById(comment._id);
    expect(deletedComment).toBeNull();

    const updatedPost = await PostModel.findById(testPost._id);
    expect(updatedPost?.comments).toBe(0);
  });

  it('should get comments by post', async () => {
    const comment1 = new CommentModel({
      content: 'Test comment 1',
      author: testUser._id,
      post: testPost._id
    });
    await comment1.save();

    const comment2 = new CommentModel({
      content: 'Test comment 2',
      author: testUser._id,
      post: testPost._id
    });
    await comment2.save();

    const res = await request.get(`/api/posts/${testPost._id}/comments`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].content).toBe('Test comment 2'); // Assuming sorted by latest
    expect(res.body[1].content).toBe('Test comment 1');
  });

  it('should not create a comment with empty content', async () => {
    const res = await request.post('/api/comments').send({
      content: '',
      author: testUser._id,
      post: testPost._id
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('content is required');
  });

  it('should not create a comment with non-existent author', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request.post('/api/comments').send({
      content: 'Test comment',
      author: fakeId,
      post: testPost._id
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('Invalid author');
  });

  it('should not create a comment for non-existent post', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request.post('/api/comments').send({
      content: 'Test comment',
      author: testUser._id,
      post: fakeId
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('Invalid post');
  });

  it('should not update a non-existent comment', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request.put(`/api/comments/${fakeId}`).send({
      content: 'Updated content'
    });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Comment not found');
  });

  it('should not delete a non-existent comment', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request.delete(`/api/comments/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Comment not found');
  });

  it('should return empty array for comments of non-existent post', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request.get(`/api/posts/${fakeId}/comments`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});