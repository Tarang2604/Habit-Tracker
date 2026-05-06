import { useState } from 'react';
import Calendar from 'react-calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import 'react-calendar/dist/Calendar.css';

const CalendarView = ({ habits, viewMode, onDateSelect }) => {
  const [date, setDate] = useState(new Date());

  const getHabitsForDate = (selectedDate) => {
    return habits.filter((habit) => {
      if (!habit.dueDate) return false;
      return isSameDay(new Date(habit.dueDate), selectedDate);
    });
  };

  const getStatusForDate = (selectedDate) => {
    const dateHabits = getHabitsForDate(selectedDate);
    if (dateHabits.length === 0) return null;

    const completed = dateHabits.filter((h) => h.completed).length;
    if (completed === 0) return 'pending';
    if (completed === dateHabits.length) return 'completed';
    return 'partial';
  };

  if (viewMode === 'month') {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Calendar View</h3>
          <Calendar
            value={date}
            onChange={(newDate) => {
              setDate(newDate);
              onDateSelect(newDate);
            }}
            className="w-full"
          />
        </div>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-3">
            Habits for {format(date, 'MMMM d, yyyy')}
          </h4>
          <div className="space-y-2">
            {getHabitsForDate(date).length === 0 ? (
              <p className="text-gray-500 text-sm">No habits scheduled for this date</p>
            ) : (
              getHabitsForDate(date).map((habit) => (
                <div
                  key={habit._id}
                  className={`p-3 rounded-lg text-sm ${
                    habit.completed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={habit.completed}
                      disabled
                      className="w-4 h-4"
                    />
                    <span className="font-medium">{habit.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold category-${habit.category?.toLowerCase()}`}>
                      {habit.category}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Week View
  const weekStart = startOfWeek(date);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Week View</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setDate(addDays(date, -7))}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setDate(addDays(date, 7))}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const dayHabits = getHabitsForDate(day);
          const status = getStatusForDate(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toString()}
              onClick={() => onDateSelect(day)}
              className={`p-3 rounded-lg cursor-pointer transition ${
                isToday ? 'border-2 border-indigo-600' : 'border border-gray-200'
              } ${
                status === 'completed'
                  ? 'bg-green-50'
                  : status === 'pending'
                    ? 'bg-red-50'
                    : status === 'partial'
                      ? 'bg-yellow-50'
                      : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="font-semibold text-gray-800 text-center mb-2">
                {format(day, 'd')}
              </div>
              <div className="text-xs text-gray-600 text-center mb-2">
                {format(day, 'EEE')}
              </div>
              {dayHabits.length > 0 && (
                <div className="text-center">
                  <div className="text-xs font-semibold">
                    {dayHabits.filter((h) => h.completed).length}/{dayHabits.length}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {status === 'completed' ? '✅' : status === 'pending' ? '⏳' : '⚠️'}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
