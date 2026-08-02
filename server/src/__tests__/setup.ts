import { MongoMemoryServer } from "mongodb-memory-server";

import mongoose from "mongoose";

import { auth } from "@config/firebaseConfig";
import { mockDecodedToken } from "@tests/helpers";
import { cache } from '@utils/cache';


jest.setTimeout(30000);

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  jest.spyOn(auth, "verifyIdToken").mockResolvedValue(mockDecodedToken);
}, 30000);

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  cache.clear();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  jest.restoreAllMocks();
});
