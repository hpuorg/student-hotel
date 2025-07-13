import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@modern-js/runtime/router';
import {
  SUPPORT_REQUEST_TYPES,
  SUPPORT_REQUEST_STATUS,
  PRIORITY_LEVELS,
  SUPPORT_REQUEST_TYPE_LABELS,
  SUPPORT_REQUEST_STATUS_LABELS,
  PRIORITY_LEVEL_LABELS,
  API_CONFIG
} from '../../../../../constants';

interface SupportRequestFormData {
  user_id: string;
  room_id: string;
  type: keyof typeof SUPPORT_REQUEST_TYPES;
  status: keyof typeof SUPPORT_REQUEST_STATUS;
  priority: keyof typeof PRIORITY_LEVELS;
  title: string;
  description: string;
  response: string;
  resolved_at: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Room {
  id: string;
  number: string;
  building: { name: string };
}

export default function EditSupportRequestPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState<SupportRequestFormData>({
    user_id: '',
    room_id: '',
    type: 'MAINTENANCE',
    status: 'OPEN',
    priority: 'MEDIUM',
    title: '',
    description: '',
    response: '',
    resolved_at: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      fetchSupportRequest(id);
    }
    fetchUsers();
    fetchRooms();
  }, [id]);

  const fetchSupportRequest = async (requestId: string) => {
    try {
      setInitialLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/support-requests/${requestId}`);
      if (response.ok) {
        const request = await response.json();
        setFormData({
          user_id: request.user_id || '',
          room_id: request.room_id || '',
          type: request.type || 'MAINTENANCE',
          status: request.status || 'OPEN',
          priority: request.priority || 'MEDIUM',
          title: request.title || '',
          description: request.description || '',
          response: request.response || '',
          resolved_at: request.resolved_at ? request.resolved_at.split('T')[0] : '',
        });
      } else if (response.status === 404) {
        navigate('/student-hotel/support-requests');
      } else {
        // Mock data for development
        setFormData({
          user_id: 'u1',
          room_id: 'r1',
          type: 'MAINTENANCE',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          title: 'Air conditioning not working',
          description: 'The air conditioning unit in my room has stopped working. It was making strange noises yesterday and now it won\'t turn on at all.',
          response: 'We have received your request and our maintenance team has been notified. A technician will visit your room tomorrow morning.',
          resolved_at: '',
        });
      }
    } catch (error) {
      console.error('Error fetching support request:', error);
    } finally {
      setInitialLoading(false);
    }
  };

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

    if (formData.status === 'RESOLVED' && !formData.resolved_at) {
      newErrors.resolved_at = 'Resolution date is required for resolved requests';
    }

    if (formData.resolved_at) {
      const resolvedDate = new Date(formData.resolved_at);
      const today = new Date();
      
      if (resolvedDate > today) {
        newErrors.resolved_at = 'Resolution date cannot be in the future';
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
      const response = await fetch(`${API_CONFIG.BASE_URL}/support-requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          room_id: formData.room_id || null,
          response: formData.response || null,
          resolved_at: formData.resolved_at || null,
        }),
      });

      if (response.ok) {
        navigate(`/student-hotel/support-requests/${id}`);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Failed to update support request' });
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
    
    // Auto-fill resolved_at when status changes to RESOLVED
    if (name === 'status' && value === 'RESOLVED' && !formData.resolved_at) {
      setFormData(prev => ({
        ...prev,
        status: value as keyof typeof SUPPORT_REQUEST_STATUS,
        resolved_at: new Date().toISOString().split('T')[0]
      }));
    }
    
    // Clear resolved_at when status changes from RESOLVED
    if (name === 'status' && value !== 'RESOLVED') {
      setFormData(prev => ({
        ...prev,
        status: value as keyof typeof SUPPORT_REQUEST_STATUS,
        resolved_at: ''
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getTypeIcon = (type: keyof typeof SUPPORT_REQUEST_TYPES) => {
    switch (type) {
      case 'MAINTENANCE': return '🔧';
      case 'CLEANING': return '🧹';
      case 'NOISE_COMPLAINT': return '🔇';
      case 'SECURITY': return '🔒';
      case 'INTERNET': return '📶';
      case 'FACILITIES': return '🏢';
      case 'OTHER': return '❓';
      default: return '❓';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Support Request</h1>
          <p className="text-gray-600">Update support request details and status</p>
        </div>
        <button
          onClick={() => navigate(`/student-hotel/support-requests/${id}`)}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Request
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

          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Request Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <option value="">Select user</option>
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
                  <option value="">Select room</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      Room {room.number} - {room.building.name}
                    </option>
                  ))}
                </select>
              </div>

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
              </div>

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

              {formData.status === 'RESOLVED' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resolution Date *
                  </label>
                  <input
                    type="date"
                    name="resolved_at"
                    value={formData.resolved_at}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.resolved_at ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.resolved_at && (
                    <p className="mt-1 text-sm text-red-600">{errors.resolved_at}</p>
                  )}
                </div>
              )}
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
              placeholder="Brief description of the issue"
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
              rows={6}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Detailed description of the issue..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Staff Response */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Staff Response
            </label>
            <textarea
              name="response"
              value={formData.response}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Response from staff regarding this request..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Provide updates, solutions, or next steps for the requester
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/student-hotel/support-requests/${id}`)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
