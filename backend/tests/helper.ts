import { MongoClient, Db, Collection } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let client: MongoClient;
let db: Db;
const baseUrl = process.env.TEST_BASE_URL;

/**
 * 连接到数据库。
 * 
 * @remarks
 * 此函数将使用环境变量中的MongoDB URI连接到数据库，并将连接保存在全局变量`client`和`db`中。
 * 
 * @returns 一个Promise，表示连接数据库的操作是否成功。
 * 
 * @example
 * ```
 * await connectToDatabase();
 * ```
 */
async function connectToDatabase() {
  const uri = process.env.TEST_MONGODB_URI as string;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db();
  console.log('Connected to database');
}

/**
 * 清空数据库中的所有数据。
 * 
 * @remarks
 * 此函数将遍历数据库中的所有集合，并删除每个集合中的所有文档。
 * 
 * @returns 一个Promise，表示清空数据库的操作是否成功。
 * 
 * @example
 * ```
 * await clearDatabase();
 * ```
 */
async function clearDatabase() {
  const collections = await db.listCollections().toArray();
  for (const collection of collections) {
    await db.collection(collection.name).deleteMany({});
  }
}

/**
 * 向指定的集合中插入模拟数据。
 * 
 * @remarks
 * 此函数将向指定的集合中插入一组模拟数据。
 * 
 * @param collection - 要插入数据的集合名称。
 * @param data - 要插入的模拟数据数组。
 * 
 * @returns 一个Promise，表示插入数据的操作是否成功。
 * 
 * @example
 * ```
 * const collection = 'users';
 * const data = [
 *   { name: 'John', age: 25 },
 *   { name: 'Jane', age: 30 },
 * ];
 * await insertMockData(collection, data);
 * ```
 */
async function insertMockData(collection: string, data: any[]) {
  await db.collection(collection).insertMany(data);
}

/**
 * 查询指定集合中的文档。
 * 
 * @remarks
 * 此函数将在指定的集合中执行查询，并返回符合查询条件的文档数组。
 * 
 * @typeparam T - 文档的类型。
 * 
 * @param collectionName - 要查询的集合名称。
 * @param query - 查询条件，默认为空对象。
 * 
 * @returns 一个Promise，表示查询结果的数组。
 * 
 * @example
 * ```
 * const collectionName = 'users';
 * const query = { age: { $gt: 18 } };
 * const result = await queryCollection<User>(collectionName, query);
 * ```
 */
async function queryCollection<T extends Document>(collectionName: string, query: object = {}): Promise<T[]> {
  const collection: Collection<T> = db.collection<T>(collectionName);
  return await collection.find(query).toArray() as T[];
}

/**
 * 关闭测试数据库连接。
 * 
 * @remarks
 * 此函数将关闭与测试数据库的连接。
 * 
 * @returns 一个Promise，表示关闭数据库连接的操作是否成功。
 * 
 * @example
 * ```
 * await teardownTestDatabase();
 * ```
 */
async function teardownTestDatabase() {
  await client.close();
}

export default {
  connectToDatabase,
  clearDatabase,
  insertMockData,
  teardownTestDatabase,
  queryCollection,
};

export { client, db, baseUrl };