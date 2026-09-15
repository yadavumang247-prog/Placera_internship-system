import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';
import { User } from './models/User.js';
import { runSeed } from './utils/seed.js';

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is freshly initialized or empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('⚡ Empty database detected. Auto-seeding full campus demo dataset...');
      await runSeed();
    }

    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`========================================================`);
      console.log(`🚀 Placera — Smart Internship & Placement Allocation Platform API`);
      console.log(`🌐 Server running on http://localhost:${PORT}`);
      console.log(`⚙️  Environment: ${config.nodeEnv}`);
      console.log(`========================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
