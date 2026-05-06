import { useEffect, useState } from 'react';
import { habitAPI } from '../services/api';
import CalendarView from '../components/CalendarView';
import NotificationSettings from '../components/NotificationSettings';
import { Plus, Edit2, Trash2, Check, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Other');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [showSettings, setShowSettings] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const res = await habitAPI.getHabits();
      setHabits(res.data);
    } catch (err) {
      setError('Could not load habits.');
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async () => {
    if (!title.trim()) {
      setError('Enter a habit name.');
      return;
    }

    try {
      setError('');
      const res = await habitAPI.addHabit({
        title: title.trim(),
        category,
        priority,
        dueDate: dueDate || null
      });
      setHabits((prev) => [res.data, ...prev]);
      setTitle('');
      setCategory('Other');
      setPriority('Medium');
      setDueDate('');
    } catch (err) {
      setError('Could not add habit.');
    }
  };

  const toggleHabit = async (id, completed) => {
    try {
      const res = await habitAPI.updateHabit(id, { completed: !completed });
      setHabits((prev) => prev.map((habit) => (habit._id === id ? res.data : habit)));
    } catch (err) {
      setError('Could not update habit.');
    }
  };

  const deleteHabit = async (id) => {
    try {
      await habitAPI.deleteHabit(id);
      setHabits((prev) => prev.filter((habit) => habit._id !== id));
    } catch (err) {
      setError('Could not delete habit.');
    }
  };

  const startEdit = (habit) => {
    setEditingId(habit._id);
    setEditTitle(habit.title);
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) {
      setError('Habit title cannot be empty.');
      return;
    }

    try {
      const res = await habitAPI.updateHabit(id, { title: editTitle.trim() });
      setHabits((prev) => prev.map((habit) => (habit._id === id ? res.data : habit)));
      setEditingId(null);
      setEditTitle('');
    } catch (err) {
      setError('Could not update habit.');
    }
  };

  const completedCount = habits.filter((habit) => habit.completed).length;
  const completionRate = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  const filteredHabits = habits.filter((habit) => {
    if (filter === 'completed') return habit.completed;
    if (filter === 'pending') return !habit.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Habit Tracker</h1>
          <p className="text-gray-600">Build better habits with daily tracking and calendar insights</p>
        </div>

        {/* View Selector */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              viewMode === 'list'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
              viewMode === 'month'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Month Calendar
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
              viewMode === 'week'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Week Calendar
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`px-4 py-2 rounded-lg font-semibold transition ml-auto ${
              showSettings
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🔔 Notifications
          </button>
        </div>

        {/* Show Notification Settings */}
        {showSettings && (
          <div className="mb-6">
            <NotificationSettings />
          </div>
        )}

        {/* Calendar View */}
        {(viewMode === 'month' || viewMode === 'week') && (
          <div className="mb-6">
            <CalendarView habits={habits} viewMode={viewMode} onDateSelect={() => {}} />
          </div>
        )}

        {/* Add Habit Form */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Habit</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={title}
                  placeholder="Habit name (e.g., Morning Jog, Read 30 min)"
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addHabit()}
                  className="input-field"
                />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field"
                >
                  <option>Health</option>
                  <option>Work</option>
                  <option>Learning</option>
                  <option>Personal</option>
                  <option>Fitness</option>
                  <option>Other</option>
                </select>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="input-field"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
                <button
                  onClick={addHabit}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Habit
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Statistics */}
        {viewMode === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-4xl font-bold text-indigo-600 mb-2">{habits.length}</div>
              <div className="text-gray-600 font-semibold">Total Habits</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {habits.filter((h) => h.completed).length}
              </div>
              <div className="text-gray-600 font-semibold">Completed Today</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {habits.length > 0
                  ? Math.round(
                      (habits.filter((h) => h.completed).length / habits.length) * 100
                    )
                  : 0}
                %
              </div>
              <div className="text-gray-600 font-semibold">Completion Rate</div>
            </div>
          </div>
        )}

        {/* Filter Buttons */}
        {viewMode === 'list' && (
          <div className="flex gap-2 mb-6">
            {['all', 'pending', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Habits List */}
        {viewMode === 'list' && (
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading habits...</p>
              </div>
            ) : filteredHabits.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600 text-lg">
                  {habits.length === 0
                    ? '📝 No habits yet. Add one to get started!'
                    : '✨ No habits in this category'}
                </p>
              </div>
            ) : (
              filteredHabits.map((habit) => (
                <div
                  key={habit._id}
                  className={`bg-white rounded-lg shadow p-4 flex items-center justify-between transition ${
                    habit.completed ? 'opacity-75 bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <input
                      type="checkbox"
                      checked={habit.completed}
                      onChange={() => toggleHabit(habit._id, habit.completed)}
                      className="w-6 h-6 rounded cursor-pointer"
                    />
                    {editingId === habit._id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="input-field flex-1"
                        autoFocus
                      />
                    ) : (
                      <div className="flex-1">
                        <h3
                          className={`font-semibold text-lg ${
                            habit.completed
                              ? 'line-through text-gray-400'
                              : 'text-gray-900'
                          }`}
                        >
                          {habit.title}
                        </h3>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {habit.category && (
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold category-${habit.category.toLowerCase()}`}
                            >
                              {habit.category}
                            </span>
                          )}
                          {habit.priority && (
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold priority-${habit.priority.toLowerCase()}`}
                            >
                              {habit.priority}
                            </span>
                          )}
                          {habit.dueDate && (
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-800">
                              Due: {new Date(habit.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {editingId === habit._id ? (
                      <>
                        <button
                          onClick={() => saveEdit(habit._id)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(habit)}
                          className="btn-secondary flex items-center gap-1"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteHabit(habit._id)}
                          className="btn-danger flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
