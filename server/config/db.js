import mongoose from 'mongoose';
import { config } from './env.js';

let mongoMemoryServer = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  try {
    // First try connecting to the configured MONGO_URI with a short timeout
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] Connected to external MongoDB at ${config.mongoUri}`);
  } catch (externalErr) {
    console.warn(`[Database] External MongoDB connection failed (${externalErr.message}).`);
    console.log('[Database] Initializing automated MongoDB In-Memory Server fallback...');
    
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`[Database] Successfully connected to In-Memory MongoDB at ${inMemoryUri}`);
    } catch (memErr) {
      console.error('[Database] Failed to initialize In-Memory MongoDB:', memErr.message);
      throw memErr;
    }
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
