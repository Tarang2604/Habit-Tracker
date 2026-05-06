const express = require('express');
const Habit = require('../models/Habit');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load habits', error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, category, priority, dueDate } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Habit title is required' });
    }

    const habit = new Habit({
      userId: req.userId,
      title,
      category: category || 'Other',
      priority: priority || 'Medium',
      dueDate: dueDate || null
    });
    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create habit', error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const habit = await Habit.findOne({ _id: id, userId: req.userId });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    Object.assign(habit, req.body);
    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update habit', error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const habit = await Habit.findOneAndDelete({ _id: id, userId: req.userId });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json({ message: 'Habit deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete habit', error: error.message });
  }
});

module.exports = router;
