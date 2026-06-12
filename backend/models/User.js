import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true, sparse: true },
  password: { type: String }, // For custom auth
  googleId: { type: String, unique: true, sparse: true }, // For Google auth
  displayName: String,
  photos: [{ value: String }],
});

const User = mongoose.model('User', userSchema);
export default User;