const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['Health', 'Work', 'Learning', 'Personal', 'Fitness', 'Other'],
      default: 'Other'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    completed: {
      type: Boolean,
      default: false
    },
    dueDate: Date,
    completedDate: Date,
    notified: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

habitSchema.index({ userId: 1, createdAt: -1 });
habitSchema.index({ userId: 1, dueDate: 1 });

module.exports = mongoose.model('Habit', habitSchema);
