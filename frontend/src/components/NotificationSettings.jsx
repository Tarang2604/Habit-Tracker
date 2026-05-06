import { useState, useEffect } from 'react';
import { Bell, Check, AlertCircle } from 'lucide-react';
import api from '../services/api';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: false,
    notificationTime: '08:00'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/notifications');
      setSettings(res.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await api.put('/notifications', settings);
      setMessageType('success');
      setMessage('Notification settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessageType('error');
      setMessage('Failed to update settings');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    setLoading(true);
    try {
      await api.post('/notifications/test-email');
      setMessageType('success');
      setMessage('Test email sent! Check your inbox.');
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessageType('error');
      setMessage('Failed to send test email. Please check your email configuration.');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-6 h-6 text-indigo-600" />
        <h3 className="text-xl font-bold text-gray-800">Notification Settings</h3>
      </div>

      {message && (
        <div
          className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
            messageType === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {messageType === 'success' ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message}</span>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-3 cursor-pointer flex-1">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  emailNotifications: e.target.checked
                })
              }
              className="w-5 h-5 rounded"
            />
            <span className="text-gray-800 font-medium">
              Enable Email Notifications for Overdue Habits
            </span>
          </label>
        </div>

        {settings.emailNotifications && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Time
            </label>
            <input
              type="time"
              value={settings.notificationTime}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notificationTime: e.target.value
                })
              }
              className="input-field"
            />
            <p className="text-xs text-gray-600 mt-1">
              You'll receive email notifications at this time each day if you have overdue habits
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t">
          <button onClick={handleUpdate} disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
          <button
            onClick={handleTestEmail}
            disabled={loading || !settings.emailNotifications}
            className="btn-secondary"
          >
            {loading ? 'Sending...' : 'Send Test Email'}
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">📧 Email Setup Required</h4>
        <p className="text-sm text-blue-800">
          To use email notifications, your admin needs to configure Gmail credentials in the
          backend .env file. See documentation for setup instructions.
        </p>
      </div>
    </div>
  );
};

export default NotificationSettings;
