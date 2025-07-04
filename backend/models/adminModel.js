import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    default: 'admin'
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;