import { useState, useEffect } from 'react';
import { useNavigate } from '@modern-js/runtime/router';
import { 
  SUPPORT_REQUEST_TYPES, 
  SUPPORT_REQUEST_STATUS, 
  PRIORITY_LEVELS,
  SUPPORT_REQUEST_TYPE_LABELS,
  SUPPORT_REQUEST_STATUS_LABELS,
  PRIORITY_LEVEL_LABELS,
  API_CONFIG 
} from '../../../../constants';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Room {
  id: string;
  number: string;
  building: {
    id: string;
    name: string;
  };
}

interface SupportRequestFormData {
  user_id: string;
  room_id: string;
  type: keyof typeof SUPPORT_REQUEST_TYPES;
  status: keyof typeof SUPPORT_REQUEST_STATUS;
  priority: keyof typeof PRIORITY_LEVELS;
  title: string;
  description: string;
  response: string;
}

export default function CreateSupportRequestPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SupportRequestFormData>({
    user_id: '',
    room_id: '',
    type: 'INQUIRY',
    status: 'OPEN',
    priority: 'MEDIUM',
    title: '',
    description: '',
    response: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchUsers();
    fetchRooms();
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

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/rooms`);
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.user_id) {
      newErrors.user_id = 'Please select a user';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
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
      const response = await fetch(`${API_CONFIG.BASE_URL}/support-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          room_id: formData.room_id || null,
          response: formData.response || null,
        }),
      });

      if (response.ok) {
        navigate('/student-hotel/support-requests');
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Failed to create support request' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getTypeIcon = (type: keyof typeof SUPPORT_REQUEST_TYPES) => {
    switch (type) {
      case 'MAINTENANCE': return '🔧';
      case 'COMPLAINT': return '😠';
      case 'INQUIRY': return '❓';
      case 'SERVICE_REQUEST': return '🛎️';
      case 'EMERGENCY': return '🚨';
      case 'OTHER': return '📝';
      default: return '📝';
    }
  };

  const getPriorityDescription = (priority: keyof typeof PRIORITY_LEVELS) => {
    switch (priority) {
      case 'LOW': return 'Non-urgent, can be addressed within a week';
      case 'MEDIUM': return 'Standard priority, should be addressed within 2-3 days';
      case 'HIGH': return 'Important issue, needs attention within 24 hours';
      case 'URGENT': return 'Critical issue requiring immediate attention';
      default: return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Support Request</h1>
          <p className="text-gray-600">Submit a new support request or complaint</p>
        </div>
        <button
          onClick={() => navigate('/student-hotel/support-requests')}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Support Requests
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requester *
              </label>
              <select
                name="user_id"
                value={formData.user_id}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.user_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select requester</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} - {user.email}
                  </option>
                ))}
              </select>
              {errors.user_id && (
                <p className="mt-1 text-sm text-red-600">{errors.user_id}</p>
              )}
            </div>

            {/* Room */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room (Optional)
              </label>
              <select
                name="room_id"
                value={formData.room_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select room (if applicable)</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    Room {room.number} - {room.building.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Leave blank for general requests
              </p>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(SUPPORT_REQUEST_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {getTypeIcon(key as keyof typeof SUPPORT_REQUEST_TYPES)} {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority *
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(PRIORITY_LEVEL_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                {getPriorityDescription(formData.priority)}
              </p>
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
                {Object.entries(SUPPORT_REQUEST_STATUS_LABELS).map(([key, label]) => (
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
              placeholder="Brief description of the issue or request"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Detailed description of the issue, including when it occurred, what you were doing, and any error messages..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Response (for staff) */}
          {formData.status !== 'OPEN' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Response (Optional)
              </label>
              <textarea
                name="response"
                value={formData.response}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Staff response or resolution details..."
              />
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/student-hotel/support-requests')}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Request'}
            </button>
          </div>
        </form>
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-blue-800 font-medium mb-2">Support Request Guidelines</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <div><strong>🚨 Emergency:</strong> Safety hazards, security issues, no power/water</div>
          <div><strong>🔴 High:</strong> Major inconvenience, equipment failure, urgent repairs</div>
          <div><strong>🟡 Medium:</strong> Minor issues, routine requests, general inquiries</div>
          <div><strong>🔵 Low:</strong> Suggestions, non-urgent improvements, general questions</div>
        </div>
        <div className="mt-3 text-sm text-blue-700">
          <strong>Tips:</strong> Be specific about the problem, include relevant details like room number, 
          time of occurrence, and steps you've already tried. This helps our team resolve issues faster.
        </div>
      </div>
    </div>
  );
}
