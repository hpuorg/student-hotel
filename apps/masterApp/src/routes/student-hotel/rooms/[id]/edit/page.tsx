import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@modern-js/runtime/router';
import { 
  ROOM_TYPES, 
  ROOM_STATUS, 
  ROOM_TYPE_LABELS, 
  ROOM_STATUS_LABELS,
  API_CONFIG 
} from '../../../../../constants';

interface Building {
  id: string;
  name: string;
  address: string;
  floors: number;
}

interface RoomFormData {
  number: string;
  building_id: string;
  floor: number;
  type: keyof typeof ROOM_TYPES;
  status: keyof typeof ROOM_STATUS;
  capacity: number;
  monthly_rate: number;
  daily_rate: number;
  area: number;
  description: string;
}

export default function EditRoomPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [formData, setFormData] = useState<RoomFormData>({
    number: '',
    building_id: '',
    floor: 1,
    type: 'SINGLE',
    status: 'AVAILABLE',
    capacity: 1,
    monthly_rate: 0,
    daily_rate: 0,
    area: 0,
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      fetchBuildings(),
      id ? fetchRoom(id) : Promise.resolve()
    ]);
  }, [id]);

  const fetchBuildings = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/buildings`);
      if (response.ok) {
        const data = await response.json();
        setBuildings(data.data || []);
      } else {
        // Mock data for development
        setBuildings([
          { id: 'b1', name: 'Building A', address: '123 Main Street', floors: 5 },
          { id: 'b2', name: 'Building B', address: '456 Oak Avenue', floors: 4 },
        ]);
      }
    } catch (error) {
      console.error('Error fetching buildings:', error);
      setBuildings([
        { id: 'b1', name: 'Building A', address: '123 Main Street', floors: 5 },
        { id: 'b2', name: 'Building B', address: '456 Oak Avenue', floors: 4 },
      ]);
    }
  };

  const fetchRoom = async (roomId: string) => {
    try {
      setInitialLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/rooms/${roomId}`);
      if (response.ok) {
        const room = await response.json();
        setFormData({
          number: room.number || '',
          building_id: room.building?.id || '',
          floor: room.floor || 1,
          type: room.type || 'SINGLE',
          status: room.status || 'AVAILABLE',
          capacity: room.capacity || 1,
          monthly_rate: room.monthly_rate || 0,
          daily_rate: room.daily_rate || 0,
          area: room.area || 0,
          description: room.description || '',
        });
      } else if (response.status === 404) {
        navigate('/student-hotel/rooms');
      } else {
        // Mock data for development
        setFormData({
          number: 'A101',
          building_id: 'b1',
          floor: 1,
          type: 'DOUBLE',
          status: 'AVAILABLE',
          capacity: 2,
          monthly_rate: 1200000,
          daily_rate: 50000,
          area: 25.5,
          description: 'Spacious double room with private bathroom and study area.',
        });
      }
    } catch (error) {
      console.error('Error fetching room:', error);
      // Use mock data for development
      setFormData({
        number: 'A101',
        building_id: 'b1',
        floor: 1,
        type: 'DOUBLE',
        status: 'AVAILABLE',
        capacity: 2,
        monthly_rate: 1200000,
        daily_rate: 50000,
        area: 25.5,
        description: 'Spacious double room with private bathroom and study area.',
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const validateForm = () => {
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

    if (formData.monthly_rate < 0) {
      newErrors.monthly_rate = 'Monthly rate cannot be negative';
    }

    if (formData.daily_rate < 0) {
      newErrors.daily_rate = 'Daily rate cannot be negative';
    }

    if (formData.area < 0) {
      newErrors.area = 'Area cannot be negative';
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
      const response = await fetch(`${API_CONFIG.BASE_URL}/rooms/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          description: formData.description || null,
          area: formData.area || null,
        }),
      });

      if (response.ok) {
        navigate(`/student-hotel/rooms/${id}`);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Failed to update room' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof RoomFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getMaxFloor = () => {
    const selectedBuilding = buildings.find(b => b.id === formData.building_id);
    return selectedBuilding ? selectedBuilding.floors : 50;
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
          onClick={() => navigate(`/student-hotel/rooms/${id}`)}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Room</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Room Information</h2>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Room Number */}
            <div>
              <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                Room Number *
              </label>
              <input
                type="text"
                id="number"
                value={formData.number}
                onChange={(e) => handleInputChange('number', e.target.value)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.number ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., A101"
              />
              {errors.number && <p className="mt-1 text-sm text-red-600">{errors.number}</p>}
            </div>

            {/* Building */}
            <div>
              <label htmlFor="building_id" className="block text-sm font-medium text-gray-700 mb-1">
                Building *
              </label>
              <select
                id="building_id"
                value={formData.building_id}
                onChange={(e) => handleInputChange('building_id', e.target.value)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.building_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select Building</option>
                {buildings.map((building) => (
                  <option key={building.id} value={building.id}>
                    {building.name}
                  </option>
                ))}
              </select>
              {errors.building_id && <p className="mt-1 text-sm text-red-600">{errors.building_id}</p>}
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Room Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Room Type *
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value as keyof typeof ROOM_TYPES)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(ROOM_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Room Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as keyof typeof ROOM_STATUS)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(ROOM_STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Capacity */}
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                Capacity *
              </label>
              <input
                type="number"
                id="capacity"
                min="1"
                max="10"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 1)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.capacity ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Number of occupants"
              />
              {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Monthly Rate */}
            <div>
              <label htmlFor="monthly_rate" className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Rate (VND) *
              </label>
              <input
                type="number"
                id="monthly_rate"
                min="0"
                step="1000"
                value={formData.monthly_rate}
                onChange={(e) => handleInputChange('monthly_rate', parseFloat(e.target.value) || 0)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.monthly_rate ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Monthly rental rate"
              />
              {errors.monthly_rate && <p className="mt-1 text-sm text-red-600">{errors.monthly_rate}</p>}
            </div>

            {/* Daily Rate */}
            <div>
              <label htmlFor="daily_rate" className="block text-sm font-medium text-gray-700 mb-1">
                Daily Rate (VND) *
              </label>
              <input
                type="number"
                id="daily_rate"
                min="0"
                step="1000"
                value={formData.daily_rate}
                onChange={(e) => handleInputChange('daily_rate', parseFloat(e.target.value) || 0)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.daily_rate ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Daily rental rate"
              />
              {errors.daily_rate && <p className="mt-1 text-sm text-red-600">{errors.daily_rate}</p>}
            </div>

            {/* Area */}
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                Area (m²)
              </label>
              <input
                type="number"
                id="area"
                min="0"
                step="0.1"
                value={formData.area}
                onChange={(e) => handleInputChange('area', parseFloat(e.target.value) || 0)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.area ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Room area in square meters"
              />
              {errors.area && <p className="mt-1 text-sm text-red-600">{errors.area}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter room description (optional)"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/student-hotel/rooms/${id}`)}
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
              {loading ? 'Updating...' : 'Update Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

            {/* Floor */}
            <div>
              <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
                Floor *
              </label>
              <input
                type="number"
                id="floor"
                min="1"
                max={getMaxFloor()}
                value={formData.floor}
                onChange={(e) => handleInputChange('floor', parseInt(e.target.value) || 1)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.floor ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.floor && <p className="mt-1 text-sm text-red-600">{errors.floor}</p>}
            </div>
          </div>
