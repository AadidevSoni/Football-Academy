import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js'; 
import Admin from './models/adminModel.js';         
import bcrypt from 'bcryptjs';             
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 7001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Update CORS origin to your frontend deployed URL or allow multiple origins
app.use(cors({
  origin: [ 'http://localhost:5174', process.env.FRONTEND_URL ], // add your Netlify/Vercel domain here
  credentials: true,
}));

app.use('/api/admin', adminRoutes);

const createDefaultAdmin = async () => {
  try {
    const exists = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
    if (!exists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, 10); 
      await Admin.create({
        username: process.env.ADMIN_USERNAME,
        password: hashedPassword,
      });
      console.log('✅ Default admin created');
    } else {
      console.log('⚠️ Admin already exists');
    }
  } catch (error) {
    console.error('❌ Failed to create admin:', error.message);
  }
};

const startServer = async () => {
  try {
    await connectDB(); // wait for DB connection first
    console.log('MongoDB connected');

    await createDefaultAdmin(); // create admin only after DB is ready

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
