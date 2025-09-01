const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      private: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      private: true,
    },
    emailVerificationExpires: {
      type: Date,
      private: true,
    },
    passwordResetToken: {
      type: String,
      private: true,
    },
    passwordResetExpires: {
      type: Date,
      private: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

/**
 * Generates a verification or password reset token.
 * @param {string} type - 'email' or 'password'.
 * @returns {string} The original, unhashed token.
 */
userSchema.methods.generateToken = function (type) {
  const user = this;
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const expirationMinutes = 10;

  if (type === 'email') {
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = Date.now() + expirationMinutes * 60 * 1000;
  } else if (type === 'password') {
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + expirationMinutes * 60 * 1000;
  }

  return token;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
