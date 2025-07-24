import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  displayName: String,
  emails: [{ value: String }],
  photos: [{ value: String }],
});

const User = mongoose.model('User', userSchema);
export default User;