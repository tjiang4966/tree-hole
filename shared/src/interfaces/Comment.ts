export interface Comment {
  id: string;
  content: string;
  author: string; // 这里使用 User 的 id
  post: string; // 这里使用 Post 的 id
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommentDto {
  content: string;
  author: string;
  post: string;
}

export interface UpdateCommentDto {
  content?: string;
}