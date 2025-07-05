import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js'; 
import Admin from './models/adminModel.js';         
import bcrypt from 'bcryptjs';             
import cors from 'cors';

dotenv.config();
const port = process.env.PORT || 7001;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: https://gro-academy-backend.onrender.com, 
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
      console.log('Default admin created');
    } else {
      console.log('Admin already exists');
    }
  } catch (error) {
    console.error('Failed to create admin:', error.message);
  }
};

createDefaultAdmin(); 

app.listen(port, () => console.log(`Server running on port ${port}`));
