import { useState, useEffect } from 'react';
import { useNavigate } from '@modern-js/runtime/router';
import { API_CONFIG, ROOM_TYPES, DEFAULT_ROOM_CAPACITY, ROUTES, RoomType } from '../../../../constants';

interface Building {
  id: string;
  name: string;
  address: string;
  floors: number;
}

interface CreateRoomForm {
  org_id: string;
  number: string;
  building_id: string;
  floor: number;
  type: RoomType;
  capacity: number;
  area: number;
  monthly_rate: number;
  daily_rate: number;
  description: string;
  created_by_id: string;
}

export default function CreateRoomPage() {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<CreateRoomForm>({
    org_id: API_CONFIG.DEFAULT_ORG_ID,
    number: '',
    building_id: '',
    floor: 1,
    type: 'DOUBLE',
    capacity: DEFAULT_ROOM_CAPACITY.DOUBLE,
    area: 25,
    monthly_rate: 1200,
    daily_rate: 50,
    description: '',
    created_by_id: 'admin',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // API Base URL from centralized config
  const API_BASE = API_CONFIG.BASE_URL;

  useEffect(() => {
    loadBuildings();
  }, []);

  const loadBuildings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/buildings`);
      const data = await response.json();
      
      if (data.success) {
        setBuildings(data.data.data || []);
      }
    } catch (error) {
      console.error('Error loading buildings:', error);
      // Mock data for demo
      setBuildings([
        { id: '1', name: 'Building A', address: '123 Main St', floors: 5 },
        { id: '2', name: 'Building B', address: '456 Oak Ave', floors: 4 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateRoomForm, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-calculate daily rate based on monthly rate
    if (field === 'monthly_rate') {
      const monthlyRate = typeof value === 'number' ? value : parseFloat(value as string);
      if (!isNaN(monthlyRate)) {
        setFormData(prev => ({ ...prev, daily_rate: Math.round(monthlyRate / 30) }));
      }
    }

    // Auto-set capacity based on room type
    if (field === 'type') {
      setFormData(prev => ({
        ...prev,
        capacity: DEFAULT_ROOM_CAPACITY[value as keyof typeof DEFAULT_ROOM_CAPACITY]
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.number.trim()) {
      newErrors.number = 'Room number is required';
    }

    if (!formData.building_id) {
      newErrors.building_id = 'Building is required';
    }

    if (formData.floor < 1) {
      newErrors.floor = 'Floor must be at least 1';
    }

    if (formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }

    if (formData.monthly_rate <= 0) {
      newErrors.monthly_rate = 'Monthly rate must be greater than 0';
    }

    if (formData.daily_rate <= 0) {
      newErrors.daily_rate = 'Daily rate must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      
      const response = await fetch(`${API_BASE}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Success - redirect to rooms list
        navigate(ROUTES.ROOMS);
      } else {
        // Handle API errors
        console.error('API Error:', data.message);
        alert('Error creating room: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Error creating room. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.ROOMS);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Room</h1>
        <p className="text-gray-600 mt-2">Add a new room to the student hotel system</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => handleInputChange('number', e.target.value)}
                  placeholder="e.g., A101"
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.number ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Building <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.building_id}
                  onChange={(e) => handleInputChange('building_id', e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.building_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a building</option>
                  {buildings.map(building => (
                    <option key={building.id} value={building.id}>
                      {building.name} - {building.address}
                    </option>
                  ))}
                </select>
                {errors.building_id && <p className="text-red-500 text-sm mt-1">{errors.building_id}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Floor <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.floor}
                  onChange={(e) => handleInputChange('floor', parseInt(e.target.value))}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.floor ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.floor && <p className="text-red-500 text-sm mt-1">{errors.floor}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="SINGLE">Single</option>
                  <option value="DOUBLE">Double</option>
                  <option value="TRIPLE">Triple</option>
                  <option value="QUAD">Quad</option>
                  <option value="DORMITORY">Dormitory</option>
                  <option value="SUITE">Suite</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.capacity ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area (m²)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Rate ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.monthly_rate}
                  onChange={(e) => handleInputChange('monthly_rate', parseFloat(e.target.value))}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.monthly_rate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.monthly_rate && <p className="text-red-500 text-sm mt-1">{errors.monthly_rate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Daily Rate ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.daily_rate}
                  onChange={(e) => handleInputChange('daily_rate', parseFloat(e.target.value))}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.daily_rate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.daily_rate && <p className="text-red-500 text-sm mt-1">{errors.daily_rate}</p>}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Optional description of the room..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {submitting && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {submitting ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
