import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@modern-js/runtime/router';
import { API_CONFIG } from '../../../../../constants';

interface Room {
  id: string;
  number: string;
  building: {
    id: string;
    name: string;
  };
}

interface AmenityFormData {
  name: string;
  description: string;
  icon: string;
  is_available: boolean;
  room_ids: string[];
}

export default function EditAmenityPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState<AmenityFormData>({
    name: '',
    description: '',
    icon: '',
    is_available: true,
    room_ids: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      fetchAmenity(id);
    }
    fetchRooms();
  }, [id]);

  const fetchAmenity = async (amenityId: string) => {
    try {
      setInitialLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/amenities/${amenityId}`);
      if (response.ok) {
        const amenity = await response.json();
        setFormData({
          name: amenity.name || '',
          description: amenity.description || '',
          icon: amenity.icon || '',
          is_available: amenity.is_available ?? true,
          room_ids: amenity.rooms?.map((r: any) => r.id) || [],
        });
      } else if (response.status === 404) {
        navigate('/student-hotel/amenities');
      } else {
        // Mock data for development
        setFormData({
          name: 'Wi-Fi Internet',
          description: 'High-speed wireless internet access available throughout the building.',
          icon: '📶',
          is_available: true,
          room_ids: ['r1', 'r2', 'r3'],
        });
      }
    } catch (error) {
      console.error('Error fetching amenity:', error);
    } finally {
      setInitialLoading(false);
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

    if (!formData.name.trim()) {
      newErrors.name = 'Amenity name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
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
      const response = await fetch(`${API_CONFIG.BASE_URL}/amenities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          description: formData.description || null,
          icon: formData.icon || null,
        }),
      });

      if (response.ok) {
        navigate(`/student-hotel/amenities/${id}`);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Failed to update amenity' });
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

  const handleRoomSelection = (roomId: string) => {
    setFormData(prev => ({
      ...prev,
      room_ids: prev.room_ids.includes(roomId)
        ? prev.room_ids.filter(id => id !== roomId)
        : [...prev.room_ids, roomId]
    }));
  };

  const selectAllRooms = () => {
    setFormData(prev => ({
      ...prev,
      room_ids: rooms.map(room => room.id)
    }));
  };

  const clearAllRooms = () => {
    setFormData(prev => ({
      ...prev,
      room_ids: []
    }));
  };

  const getCommonIcons = () => {
    return [
      { icon: '📶', name: 'Wi-Fi' },
      { icon: '❄️', name: 'Air Conditioning' },
      { icon: '🚿', name: 'Bathroom' },
      { icon: '📚', name: 'Study Area' },
      { icon: '🏋️', name: 'Gym' },
      { icon: '🧺', name: 'Laundry' },
      { icon: '🍽️', name: 'Kitchen' },
      { icon: '📺', name: 'TV' },
      { icon: '🅿️', name: 'Parking' },
      { icon: '🔒', name: 'Security' },
      { icon: '🌡️', name: 'Heating' },
      { icon: '💡', name: 'Lighting' },
    ];
  };

  const groupRoomsByBuilding = () => {
    return rooms.reduce((acc, room) => {
      const buildingName = room.building.name;
      if (!acc[buildingName]) {
        acc[buildingName] = [];
      }
      acc[buildingName].push(room);
      return acc;
    }, {} as Record<string, Room[]>);
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const roomsByBuilding = groupRoomsByBuilding();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Amenity</h1>
          <p className="text-gray-600">Update amenity details and room assignments</p>
        </div>
        <button
          onClick={() => navigate(`/student-hotel/amenities/${id}`)}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Amenity
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenity Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Wi-Fi Internet"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="📶"
                  />
                  <div className="flex space-x-1">
                    {getCommonIcons().slice(0, 4).map((item) => (
                      <button
                        key={item.icon}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, icon: item.icon }))}
                        className="px-2 py-2 text-lg border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        title={item.name}
                      >
                        {item.icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {getCommonIcons().slice(4).map((item) => (
                    <button
                      key={item.icon}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, icon: item.icon }))}
                      className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      title={item.name}
                    >
                      {item.icon} {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Detailed description of the amenity..."
            />
          </div>

          {/* Availability */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_available"
                checked={formData.is_available}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Amenity is currently available
              </span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/student-hotel/amenities/${id}`)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Amenity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
