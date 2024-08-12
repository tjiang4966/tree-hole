export interface Post {
  id: string;
  content: string;
  author: string; // 这里使用 User 的 id
  likes: number;
  comments: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostDto {
  content: string;
  author: string;
}

export interface UpdatePostDto {
  content?: string;
}