import { useState, useEffect } from 'react';
import { useNavigate } from '@modern-js/runtime/router';
import { 
  NOTIFICATION_TYPES, 
  NOTIFICATION_STATUS,
  NOTIFICATION_TYPE_LABELS,
  NOTIFICATION_STATUS_LABELS,
  API_CONFIG 
} from '../../../../constants';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface NotificationFormData {
  user_id: string;
  type: keyof typeof NOTIFICATION_TYPES;
  title: string;
  message: string;
  status: keyof typeof NOTIFICATION_STATUS;
  send_immediately: boolean;
  scheduled_for: string;
}

export default function CreateNotificationPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<NotificationFormData>({
    user_id: '',
    type: 'GENERAL',
    title: '',
    message: '',
    status: 'DRAFT',
    send_immediately: false,
    scheduled_for: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [recipientType, setRecipientType] = useState<'individual' | 'all' | 'role'>('individual');
  const [selectedRole, setSelectedRole] = useState<string>('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (recipientType === 'individual' && !formData.user_id) {
      newErrors.user_id = 'Please select a recipient';
    }

    if (recipientType === 'role' && !selectedRole) {
      newErrors.selectedRole = 'Please select a role';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    if (formData.status === 'SCHEDULED' && !formData.scheduled_for) {
      newErrors.scheduled_for = 'Scheduled time is required for scheduled notifications';
    }

    if (formData.scheduled_for) {
      const scheduledTime = new Date(formData.scheduled_for);
      const now = new Date();
      
      if (scheduledTime <= now) {
        newErrors.scheduled_for = 'Scheduled time must be in the future';
      }
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
      const notificationData = {
        ...formData,
        user_id: recipientType === 'individual' ? formData.user_id : null,
        recipient_type: recipientType,
        recipient_role: recipientType === 'role' ? selectedRole : null,
        scheduled_for: formData.scheduled_for || null,
        status: formData.send_immediately ? 'SENT' : formData.status,
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });

      if (response.ok) {
        navigate('/student-hotel/notifications');
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Failed to create notification' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getTypeIcon = (type: keyof typeof NOTIFICATION_TYPES) => {
    switch (type) {
      case 'PAYMENT_REMINDER': return '💰';
      case 'BOOKING_CONFIRMATION': return '✅';
      case 'MAINTENANCE_UPDATE': return '🔧';
      case 'SYSTEM_ANNOUNCEMENT': return '📢';
      case 'EMERGENCY_ALERT': return '🚨';
      case 'GENERAL': return '📝';
      default: return '📝';
    }
  };

  const getMessageTemplate = (type: keyof typeof NOTIFICATION_TYPES) => {
    switch (type) {
      case 'PAYMENT_REMINDER':
        return {
          title: 'Payment Reminder',
          message: 'Your payment of [AMOUNT] is due on [DATE]. Please make your payment to avoid late fees.'
        };
      case 'BOOKING_CONFIRMATION':
        return {
          title: 'Booking Confirmed',
          message: 'Your booking for Room [ROOM_NUMBER] from [CHECK_IN] to [CHECK_OUT] has been confirmed. Welcome!'
        };
      case 'MAINTENANCE_UPDATE':
        return {
          title: 'Maintenance Update',
          message: 'Your maintenance request for [ISSUE] has been [STATUS]. [ADDITIONAL_INFO]'
        };
      case 'SYSTEM_ANNOUNCEMENT':
        return {
          title: 'Important Announcement',
          message: 'We would like to inform all residents about [ANNOUNCEMENT_DETAILS]. Please take note of the following information.'
        };
      case 'EMERGENCY_ALERT':
        return {
          title: 'Emergency Alert',
          message: 'URGENT: [EMERGENCY_DETAILS]. Please follow the instructions immediately for your safety.'
        };
      default:
        return {
          title: '',
          message: ''
        };
    }
  };

  const applyTemplate = () => {
    const template = getMessageTemplate(formData.type);
    setFormData(prev => ({
      ...prev,
      title: template.title,
      message: template.message
    }));
  };

  const getUniqueRoles = () => {
    const roles = [...new Set(users.map(user => user.role))];
    return roles;
  };

  const getRecipientCount = () => {
    switch (recipientType) {
      case 'individual':
        return 1;
      case 'all':
        return users.length;
      case 'role':
        return users.filter(user => user.role === selectedRole).length;
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Notification</h1>
          <p className="text-gray-600">Send notifications to students and staff</p>
        </div>
        <button
          onClick={() => navigate('/student-hotel/notifications')}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Notifications
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-red-800">{errors.submit}</div>
            </div>
          )}

          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Recipients *
            </label>
            <div className="space-y-4">
              {/* Recipient Type Selection */}
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="recipientType"
                    value="individual"
                    checked={recipientType === 'individual'}
                    onChange={(e) => setRecipientType(e.target.value as 'individual')}
                    className="mr-2"
                  />
                  Individual User
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="recipientType"
                    value="role"
                    checked={recipientType === 'role'}
                    onChange={(e) => setRecipientType(e.target.value as 'role')}
                    className="mr-2"
                  />
                  By Role
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="recipientType"
                    value="all"
                    checked={recipientType === 'all'}
                    onChange={(e) => setRecipientType(e.target.value as 'all')}
                    className="mr-2"
                  />
                  All Users
                </label>
              </div>

              {/* Individual User Selection */}
              {recipientType === 'individual' && (
                <div>
                  <select
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.user_id ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select user</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.first_name} {user.last_name} - {user.role} ({user.email})
                      </option>
                    ))}
                  </select>
                  {errors.user_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.user_id}</p>
                  )}
                </div>
              )}

              {/* Role Selection */}
              {recipientType === 'role' && (
                <div>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.selectedRole ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select role</option>
                    {getUniqueRoles().map((role) => (
                      <option key={role} value={role}>
                        {role} ({users.filter(u => u.role === role).length} users)
                      </option>
                    ))}
                  </select>
                  {errors.selectedRole && (
                    <p className="mt-1 text-sm text-red-600">{errors.selectedRole}</p>
                  )}
                </div>
              )}

              {/* Recipient Count */}
              <div className="text-sm text-gray-600">
                Will send to: <strong>{getRecipientCount()} recipient(s)</strong>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notification Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Type *
              </label>
              <div className="flex space-x-2">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(NOTIFICATION_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {getTypeIcon(key as keyof typeof NOTIFICATION_TYPES)} {label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={applyTemplate}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Template
                </button>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(NOTIFICATION_STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Notification title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={6}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.message ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Notification message content..."
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Use placeholders like [NAME], [ROOM_NUMBER], [DATE] for dynamic content
            </p>
          </div>

          {/* Scheduling Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Delivery Options
            </label>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="send_immediately"
                  checked={formData.send_immediately}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Send immediately upon creation
              </label>

              {formData.status === 'SCHEDULED' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduled For *
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduled_for"
                    value={formData.scheduled_for}
                    onChange={handleInputChange}
                    min={new Date().toISOString().slice(0, 16)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.scheduled_for ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.scheduled_for && (
                    <p className="mt-1 text-sm text-red-600">{errors.scheduled_for}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/student-hotel/notifications')}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : formData.send_immediately ? 'Create & Send' : 'Create Notification'}
            </button>
          </div>
        </form>
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-blue-800 font-medium mb-2">Notification Guidelines</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <div>• <strong>Emergency Alerts:</strong> Use only for urgent safety or security issues</div>
          <div>• <strong>Payment Reminders:</strong> Send 7 days before due date, then 1 day after</div>
          <div>• <strong>Maintenance Updates:</strong> Keep residents informed of progress and completion</div>
          <div>• <strong>System Announcements:</strong> For facility-wide information and policy changes</div>
          <div>• <strong>Timing:</strong> Avoid sending notifications late at night (after 9 PM)</div>
        </div>
      </div>
    </div>
  );
}
