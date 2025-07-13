import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@modern-js/runtime/router';
import { 
  MAINTENANCE_CATEGORIES, 
  MAINTENANCE_STATUS, 
  MAINTENANCE_PRIORITY,
  MAINTENANCE_CATEGORY_LABELS,
  MAINTENANCE_STATUS_LABELS,
  MAINTENANCE_PRIORITY_LABELS,
  API_CONFIG 
} from '../../../../../constants';

interface MaintenanceFormData {
  user_id: string;
  room_id: string;
  category: keyof typeof MAINTENANCE_CATEGORIES;
  status: keyof typeof MAINTENANCE_STATUS;
  priority: keyof typeof MAINTENANCE_PRIORITY;
  title: string;
  description: string;
  estimated_cost: number;
  actual_cost: number;
  scheduled_date: string;
  completed_at: string;
  notes: string;
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

export default function EditMaintenancePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState<MaintenanceFormData>({
    user_id: '',
    room_id: '',
    category: 'PLUMBING',
    status: 'PENDING',
    priority: 'MEDIUM',
    title: '',
    description: '',
    estimated_cost: 0,
    actual_cost: 0,
    scheduled_date: '',
    completed_at: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      fetchMaintenance(id);
    }
    fetchUsers();
    fetchRooms();
  }, [id]);

  const fetchMaintenance = async (maintenanceId: string) => {
    try {
      setInitialLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/maintenance/${maintenanceId}`);
      if (response.ok) {
        const maintenance = await response.json();
        setFormData({
          user_id: maintenance.user_id || '',
          room_id: maintenance.room_id || '',
          category: maintenance.category || 'PLUMBING',
          status: maintenance.status || 'PENDING',
          priority: maintenance.priority || 'MEDIUM',
          title: maintenance.title || '',
          description: maintenance.description || '',
          estimated_cost: maintenance.estimated_cost || 0,
          actual_cost: maintenance.actual_cost || 0,
          scheduled_date: maintenance.scheduled_date ? maintenance.scheduled_date.split('T')[0] : '',
          completed_at: maintenance.completed_at ? maintenance.completed_at.split('T')[0] : '',
          notes: maintenance.notes || '',
        });
      } else if (response.status === 404) {
        navigate('/student-hotel/maintenance');
      } else {
        // Mock data for development
        setFormData({
          user_id: 'u1',
          room_id: 'r1',
          category: 'HVAC',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          title: 'Air conditioning repair',
          description: 'AC unit in Room 101 is not cooling properly. Making strange noises and warm air coming out.',
          estimated_cost: 1500000,
          actual_cost: 1200000,
          scheduled_date: '2024-02-16',
          completed_at: '2024-02-16',
          notes: 'Replaced faulty compressor and cleaned filters. System tested and working normally.',
        });
      }
    } catch (error) {
      console.error('Error fetching maintenance:', error);
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

    if (formData.estimated_cost < 0) {
      newErrors.estimated_cost = 'Estimated cost cannot be negative';
    }

    if (formData.actual_cost < 0) {
      newErrors.actual_cost = 'Actual cost cannot be negative';
    }

    if (formData.scheduled_date) {
      const scheduledDate = new Date(formData.scheduled_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (scheduledDate < today && formData.status === 'PENDING') {
        newErrors.scheduled_date = 'Scheduled date cannot be in the past for pending maintenance';
      }
    }

    if (formData.status === 'COMPLETED' && !formData.completed_at) {
      newErrors.completed_at = 'Completion date is required for completed maintenance';
    }

    if (formData.completed_at) {
      const completedDate = new Date(formData.completed_at);
      const today = new Date();
      
      if (completedDate > today) {
        newErrors.completed_at = 'Completion date cannot be in the future';
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
      const response = await fetch(`${API_CONFIG.BASE_URL}/maintenance/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          user_id: formData.user_id || null,
          room_id: formData.room_id || null,
          estimated_cost: formData.estimated_cost || null,
          actual_cost: formData.actual_cost || null,
          scheduled_date: formData.scheduled_date || null,
          completed_at: formData.completed_at || null,
          notes: formData.notes || null,
        }),
      });

      if (response.ok) {
        navigate(`/student-hotel/maintenance/${id}`);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Failed to update maintenance request' });
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
      [name]: name === 'estimated_cost' || name === 'actual_cost' ? parseFloat(value) || 0 : value
    }));
    
    // Auto-fill completed_at when status changes to COMPLETED
    if (name === 'status' && value === 'COMPLETED' && !formData.completed_at) {
      setFormData(prev => ({
        ...prev,
        status: value as keyof typeof MAINTENANCE_STATUS,
        completed_at: new Date().toISOString().split('T')[0]
      }));
    }
    
    // Clear completed_at when status changes from COMPLETED
    if (name === 'status' && value !== 'COMPLETED') {
      setFormData(prev => ({
        ...prev,
        status: value as keyof typeof MAINTENANCE_STATUS,
        completed_at: ''
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getCategoryIcon = (category: keyof typeof MAINTENANCE_CATEGORIES) => {
    switch (category) {
      case 'PLUMBING': return '🚰';
      case 'ELECTRICAL': return '⚡';
      case 'HVAC': return '❄️';
      case 'APPLIANCES': return '🔌';
      case 'FURNITURE': return '🪑';
      case 'CLEANING': return '🧹';
      case 'SECURITY': return '🔒';
      case 'OTHER': return '🔧';
      default: return '🔧';
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Maintenance Request</h1>
          <p className="text-gray-600">Update maintenance details and status</p>
        </div>
        <button
          onClick={() => navigate(`/student-hotel/maintenance/${id}`)}
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
                  Requester (Optional)
                </label>
                <select
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} - {user.email}
                    </option>
                  ))}
                </select>
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
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(MAINTENANCE_CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {getCategoryIcon(key as keyof typeof MAINTENANCE_CATEGORIES)} {label}
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
                  {Object.entries(MAINTENANCE_PRIORITY_LABELS).map(([key, label]) => (
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
                  {Object.entries(MAINTENANCE_STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-6">
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
                placeholder="Brief description of the maintenance issue"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Detailed description of the maintenance work needed..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Cost Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cost Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Cost (VND)
                </label>
                <input
                  type="number"
                  name="estimated_cost"
                  value={formData.estimated_cost}
                  onChange={handleInputChange}
                  min="0"
                  step="10000"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.estimated_cost ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.estimated_cost && (
                  <p className="mt-1 text-sm text-red-600">{errors.estimated_cost}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actual Cost (VND)
                </label>
                <input
                  type="number"
                  name="actual_cost"
                  value={formData.actual_cost}
                  onChange={handleInputChange}
                  min="0"
                  step="10000"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.actual_cost ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.actual_cost && (
                  <p className="mt-1 text-sm text-red-600">{errors.actual_cost}</p>
                )}
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  name="scheduled_date"
                  value={formData.scheduled_date}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.scheduled_date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.scheduled_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.scheduled_date}</p>
                )}
              </div>

              {formData.status === 'COMPLETED' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Completion Date *
                  </label>
                  <input
                    type="date"
                    name="completed_at"
                    value={formData.completed_at}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.completed_at ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.completed_at && (
                    <p className="mt-1 text-sm text-red-600">{errors.completed_at}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Work Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Work performed, parts used, recommendations, etc..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/student-hotel/maintenance/${id}`)}
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
