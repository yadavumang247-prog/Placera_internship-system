import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';
import { User } from './models/User.js';
import { runSeed } from './utils/seed.js';

const startServer = async () => {
  const PORT = config.port;

  // Start HTTP listener immediately so Vite proxy never gets ECONNREFUSED
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`========================================================`);
    console.log(`🚀 Placera — Smart Internship & Placement Allocation Platform API`);
    console.log(`🌐 Server running on http://127.0.0.1:${PORT}`);
    console.log(`⚙️  Environment: ${config.nodeEnv}`);
    console.log(`========================================================`);
  });

  try {
    await connectDB();

    // Auto-seed if database is freshly initialized or empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('⚡ Empty database detected. Auto-seeding full campus demo dataset...');
      await runSeed();
    }
    console.log('✨ System initialized and ready for requests.');
  } catch (err) {
    console.error('⚠️ Database initialization error:', err.message);
    console.warn('💡 Tip: If using local MongoDB, ensure it is running on port 27017, or set MONGO_URI in .env to a MongoDB Atlas cluster URI.');
  }
};

startServer();
