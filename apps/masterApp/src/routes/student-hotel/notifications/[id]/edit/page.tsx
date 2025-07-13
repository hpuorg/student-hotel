import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@modern-js/runtime/router';
import { 
  NOTIFICATION_TYPES, 
  NOTIFICATION_STATUS,
  NOTIFICATION_TYPE_LABELS,
  NOTIFICATION_STATUS_LABELS,
  USER_ROLES,
  USER_ROLE_LABELS,
  API_CONFIG 
} from '../../../../../constants';

interface NotificationFormData {
  type: keyof typeof NOTIFICATION_TYPES;
  title: string;
  message: string;
  status: keyof typeof NOTIFICATION_STATUS;
  recipient_type: 'individual' | 'all' | 'role';
  recipient_role: string;
  user_id: string;
  scheduled_for: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export default function EditNotificationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<NotificationFormData>({
    type: 'SYSTEM_ANNOUNCEMENT',
    title: '',
    message: '',
    status: 'UNREAD',
    recipient_type: 'all',
    recipient_role: '',
    user_id: '',
    scheduled_for: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      fetchUsers(),
      id ? fetchNotification(id) : Promise.resolve()
    ]);
  }, [id]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || []);
      } else {
        // Mock data for development
        setUsers([
          { id: 'u1', first_name: 'John', last_name: 'Doe', email: 'john.doe@student.hpu.edu.vn', role: 'STUDENT' },
          { id: 'u2', first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@hpu.edu.vn', role: 'STAFF' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([
        { id: 'u1', first_name: 'John', last_name: 'Doe', email: 'john.doe@student.hpu.edu.vn', role: 'STUDENT' },
        { id: 'u2', first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@hpu.edu.vn', role: 'STAFF' },
      ]);
    }
  };

  const fetchNotification = async (notificationId: string) => {
    try {
      setInitialLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/notifications/${notificationId}`);
      if (response.ok) {
        const notification = await response.json();
        setFormData({
          type: notification.type || 'SYSTEM_ANNOUNCEMENT',
          title: notification.title || '',
          message: notification.message || '',
          status: notification.status || 'UNREAD',
          recipient_type: notification.recipient_type || 'all',
          recipient_role: notification.recipient_role || '',
          user_id: notification.user_id || '',
          scheduled_for: notification.scheduled_for ? notification.scheduled_for.split('T')[0] : '',
        });
      } else if (response.status === 404) {
        navigate('/student-hotel/notifications');
      } else {
        // Mock data for development
        setFormData({
          type: 'SYSTEM_ANNOUNCEMENT',
          title: 'System Maintenance Notice',
          message: 'The student accommodation system will undergo scheduled maintenance on Sunday from 2:00 AM to 6:00 AM. During this time, some services may be temporarily unavailable.',
          status: 'UNREAD',
          recipient_type: 'all',
          recipient_role: '',
          user_id: '',
          scheduled_for: '',
        });
      }
    } catch (error) {
      console.error('Error fetching notification:', error);
      // Use mock data for development
      setFormData({
        type: 'SYSTEM_ANNOUNCEMENT',
        title: 'System Maintenance Notice',
        message: 'The student accommodation system will undergo scheduled maintenance on Sunday from 2:00 AM to 6:00 AM. During this time, some services may be temporarily unavailable.',
        status: 'UNREAD',
        recipient_type: 'all',
        recipient_role: '',
        user_id: '',
        scheduled_for: '',
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    if (formData.recipient_type === 'individual' && !formData.user_id) {
      newErrors.user_id = 'User is required for individual notifications';
    }

    if (formData.recipient_type === 'role' && !formData.recipient_role) {
      newErrors.recipient_role = 'Role is required for role-based notifications';
    }

    if (formData.scheduled_for && new Date(formData.scheduled_for) < new Date()) {
      newErrors.scheduled_for = 'Scheduled time cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/notifications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          user_id: formData.recipient_type === 'individual' ? formData.user_id : null,
          recipient_role: formData.recipient_type === 'role' ? formData.recipient_role : null,
          scheduled_for: formData.scheduled_for || null,
        }),
      });

      if (response.ok) {
        navigate(`/student-hotel/notifications/${id}`);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Failed to update notification' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof NotificationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(`/student-hotel/notifications/${id}`)}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Notification</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Notification Details</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{errors.submit}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notification Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(NOTIFICATION_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(NOTIFICATION_STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter notification title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message *
            </label>
            <textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.message ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter notification message"
            />
            {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
          </div>

          {/* Recipients */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Recipients *</label>

            <div className="space-y-3">
              {/* All Users */}
              <div className="flex items-center">
                <input
                  id="recipient_all"
                  type="radio"
                  name="recipient_type"
                  value="all"
                  checked={formData.recipient_type === 'all'}
                  onChange={(e) => handleInputChange('recipient_type', e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="recipient_all" className="ml-3 block text-sm text-gray-700">
                  All Users
                </label>
              </div>

              {/* Specific Role */}
              <div className="flex items-center">
                <input
                  id="recipient_role"
                  type="radio"
                  name="recipient_type"
                  value="role"
                  checked={formData.recipient_type === 'role'}
                  onChange={(e) => handleInputChange('recipient_type', e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="recipient_role" className="ml-3 block text-sm text-gray-700">
                  Specific Role
                </label>
              </div>

              {/* Individual User */}
              <div className="flex items-center">
                <input
                  id="recipient_individual"
                  type="radio"
                  name="recipient_type"
                  value="individual"
                  checked={formData.recipient_type === 'individual'}
                  onChange={(e) => handleInputChange('recipient_type', e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="recipient_individual" className="ml-3 block text-sm text-gray-700">
                  Individual User
                </label>
              </div>
            </div>

            {/* Role Selection */}
            {formData.recipient_type === 'role' && (
              <div>
                <label htmlFor="recipient_role_select" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Role *
                </label>
                <select
                  id="recipient_role_select"
                  value={formData.recipient_role}
                  onChange={(e) => handleInputChange('recipient_role', e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.recipient_role ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Role</option>
                  {Object.entries(USER_ROLE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                {errors.recipient_role && <p className="mt-1 text-sm text-red-600">{errors.recipient_role}</p>}
              </div>
            )}

            {/* User Selection */}
            {formData.recipient_type === 'individual' && (
              <div>
                <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Select User *
                </label>
                <select
                  id="user_id"
                  value={formData.user_id}
                  onChange={(e) => handleInputChange('user_id', e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.user_id ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.email})
                    </option>
                  ))}
                </select>
                {errors.user_id && <p className="mt-1 text-sm text-red-600">{errors.user_id}</p>}
              </div>
            )}
          </div>

          {/* Scheduled For */}
          <div>
            <label htmlFor="scheduled_for" className="block text-sm font-medium text-gray-700 mb-1">
              Schedule For (Optional)
            </label>
            <input
              type="datetime-local"
              id="scheduled_for"
              value={formData.scheduled_for}
              onChange={(e) => handleInputChange('scheduled_for', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.scheduled_for ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.scheduled_for && <p className="mt-1 text-sm text-red-600">{errors.scheduled_for}</p>}
            <p className="mt-1 text-sm text-gray-500">Leave empty to send immediately</p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/student-hotel/notifications/${id}`)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Updating...' : 'Update Notification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
