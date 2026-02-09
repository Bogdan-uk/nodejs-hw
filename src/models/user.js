import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minlength: 8,
    },
    avatar: {
      type: String,
      default: "https://ac.goit.global/fullstack/react/default-avatar.jpg",
      required: false,
    },
  },
  { timestamps: true },
);
userSchema.pre('save', function () {
  if (!this.username) {
    this.username = this.email;
  }
});
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};
export const User = mongoose.model('User', userSchema);
