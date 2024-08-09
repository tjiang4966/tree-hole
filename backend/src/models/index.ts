// src/models/index.ts

import User from './User';
import AcornBox from './AcornBox';
import Reply from './Reply';

export {
  User,
  AcornBox,
  Reply
};

// 你也可以选择默认导出所有模型
export default {
  User,
  AcornBox,
  Reply
};

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       $ref: '#/components/schemas/User'
 *     AcornBox:
 *       $ref: '#/components/schemas/AcornBox'
 *     Reply:
 *       $ref: '#/components/schemas/Reply'
 */
