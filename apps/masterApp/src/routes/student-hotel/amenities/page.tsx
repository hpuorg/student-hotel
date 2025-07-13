import { useState, useEffect } from 'react';
import { Link } from '@modern-js/runtime/router';
import { API_CONFIG } from '../../../constants';

interface Amenity {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  created_at: string;
  updated_at: string;
  _count?: {
    rooms: number;
  };
}

export default function AmenitiesPage() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/amenities`);
      if (response.ok) {
        const data = await response.json();
        setAmenities(data);
      } else {
        // Mock data for development
        const mockAmenities: Amenity[] = [
          {
            id: '1',
            name: 'Wi-Fi',
            description: 'High-speed wireless internet access',
            icon: '📶',
            created_at: '2024-01-01T08:00:00Z',
            updated_at: '2024-01-01T08:00:00Z',
            _count: { rooms: 25 }
          },
          {
            id: '2',
            name: 'Air Conditioning',
            description: 'Climate control system for comfort',
            icon: '❄️',
            created_at: '2024-01-01T08:00:00Z',
            updated_at: '2024-01-01T08:00:00Z',
            _count: { rooms: 20 }
          },
          {
            id: '3',
            name: 'Private Bathroom',
            description: 'Individual bathroom with shower',
            icon: '🚿',
            created_at: '2024-01-01T08:00:00Z',
            updated_at: '2024-01-01T08:00:00Z',
            _count: { rooms: 15 }
          },
          {
            id: '4',
            name: 'Study Desk',
            description: 'Dedicated workspace for studying',
            icon: '📚',
            created_at: '2024-01-01T08:00:00Z',
            updated_at: '2024-01-01T08:00:00Z',
            _count: { rooms: 25 }
          },
          {
            id: '5',
            name: 'Wardrobe',
            description: 'Built-in storage for clothes',
            icon: '👔',
            created_at: '2024-01-01T08:00:00Z',
            updated_at: '2024-01-01T08:00:00Z',
            _count: { rooms: 25 }
          },
          {
            id: '6',
            name: 'Mini Fridge',
            description: 'Small refrigerator for personal use',
            icon: '🧊',
            created_at: '2024-01-01T08:00:00Z',
            updated_at: '2024-01-01T08:00:00Z',
            _count: { rooms: 12 }
          }
        ];
        setAmenities(mockAmenities);
      }
    } catch (error) {
      console.error('Error fetching amenities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAmenities = amenities.filter(amenity => {
    const matchesSearch = 
      amenity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (amenity.description && amenity.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Amenities</h1>
          <p className="text-gray-600">Manage room amenities and features</p>
        </div>
        <Link
          to="/student-hotel/amenities/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Amenity
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setSearchTerm('')}
              className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear Search
            </button>
          </div>
        </div>
      </div>

      {/* Amenities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAmenities.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500">No amenities found</div>
          </div>
        ) : (
          filteredAmenities.map((amenity) => (
            <div key={amenity.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">
                    {amenity.icon || '🏠'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{amenity.name}</h3>
                    {amenity.description && (
                      <p className="text-sm text-gray-600 mt-1">{amenity.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/student-hotel/amenities/${amenity.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900 text-sm"
                  >
                    Edit
                  </Link>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div>
                    Used in {amenity._count?.rooms || 0} rooms
                  </div>
                  <div>
                    Created {formatDate(amenity.created_at)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Alternative Table View */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">All Amenities</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amenity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rooms
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAmenities.map((amenity) => (
                <tr key={amenity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">
                        {amenity.icon || '🏠'}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {amenity.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      {amenity.description || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {amenity._count?.rooms || 0} rooms
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(amenity.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/student-hotel/amenities/${amenity.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                      <Link
                        to={`/student-hotel/amenities/${amenity.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
