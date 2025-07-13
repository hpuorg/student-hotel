import { useState, useEffect } from 'react';
import { useParams, Link } from '@modern-js/runtime/router';
import { API_CONFIG } from '../../../../constants';

interface Room {
  id: string;
  number: string;
  building: {
    name: string;
  };
}

interface Amenity {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  rooms: Room[];
}

export default function AmenityViewPage() {
  const { id } = useParams();
  const [amenity, setAmenity] = useState<Amenity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchAmenity(id);
    }
  }, [id]);

  const fetchAmenity = async (amenityId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/amenities/${amenityId}`);
      if (response.ok) {
        const data = await response.json();
        setAmenity(data);
      } else if (response.status === 404) {
        setError('Amenity not found');
      } else {
        // Mock data for development
        const mockAmenity: Amenity = {
          id: amenityId,
          name: 'Wi-Fi Internet',
          description: 'High-speed wireless internet access available throughout the building. Free for all residents with speeds up to 100 Mbps.',
          icon: '📶',
          is_available: true,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
          rooms: [
            {
              id: 'r1',
              number: '101',
              building: { name: 'Building A' }
            },
            {
              id: 'r2',
              number: '102',
              building: { name: 'Building A' }
            },
            {
              id: 'r3',
              number: '201',
              building: { name: 'Building A' }
            },
            {
              id: 'r4',
              number: '101',
              building: { name: 'Building B' }
            },
            {
              id: 'r5',
              number: '102',
              building: { name: 'Building B' }
            }
          ]
        };
        setAmenity(mockAmenity);
      }
    } catch (error) {
      setError('Failed to load amenity details');
      console.error('Error fetching amenity:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const groupRoomsByBuilding = () => {
    if (!amenity?.rooms) return {};
    
    return amenity.rooms.reduce((acc, room) => {
      const buildingName = room.building.name;
      if (!acc[buildingName]) {
        acc[buildingName] = [];
      }
      acc[buildingName].push(room);
      return acc;
    }, {} as Record<string, Room[]>);
  };

  const getUsageStats = () => {
    const totalRooms = amenity?.rooms.length || 0;
    const buildingCount = Object.keys(groupRoomsByBuilding()).length;
    
    return {
      totalRooms,
      buildingCount,
      utilizationRate: totalRooms > 0 ? 100 : 0 // Mock utilization rate
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !amenity) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">{error || 'Amenity not found'}</div>
        <Link
          to="/student-hotel/amenities"
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Amenities
        </Link>
      </div>
    );
  }

  const roomsByBuilding = groupRoomsByBuilding();
  const stats = getUsageStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {amenity.icon && (
                <span className="text-3xl">{amenity.icon}</span>
              )}
              <h1 className="text-2xl font-bold text-gray-900">{amenity.name}</h1>
            </div>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
              amenity.is_available 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {amenity.is_available ? 'Available' : 'Unavailable'}
            </span>
          </div>
          <p className="text-gray-600 mt-1">
            Created {formatDate(amenity.created_at)}
            {amenity.updated_at !== amenity.created_at && ` • Updated ${formatDate(amenity.updated_at)}`}
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/student-hotel/amenities/${amenity.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Amenity
          </Link>
          <Link
            to="/student-hotel/amenities"
            className="text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded-md transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Amenities
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Amenity Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Description</h2>
            </div>
            <div className="p-6">
              {amenity.description ? (
                <p className="text-gray-700 leading-relaxed">{amenity.description}</p>
              ) : (
                <p className="text-gray-500 italic">No description available</p>
              )}
            </div>
          </div>

          {/* Room Assignments by Building */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Room Assignments</h2>
            </div>
            <div className="p-6">
              {Object.keys(roomsByBuilding).length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="text-gray-500">This amenity is not assigned to any rooms yet</p>
                  <Link
                    to={`/student-hotel/amenities/${amenity.id}/edit`}
                    className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Assign to Rooms
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(roomsByBuilding).map(([buildingName, rooms]) => (
                    <div key={buildingName}>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">{buildingName}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {rooms.map((room) => (
                          <Link
                            key={room.id}
                            to={`/student-hotel/rooms/${room.id}`}
                            className="flex items-center justify-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-sm font-medium text-gray-900">
                              Room {room.number}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Usage Guidelines */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Usage Guidelines</h2>
            </div>
            <div className="p-6">
              <div className="prose max-w-none text-sm text-gray-700">
                {amenity.name.toLowerCase().includes('wifi') || amenity.name.toLowerCase().includes('internet') ? (
                  <div className="space-y-2">
                    <p>• Network name: StudentHotel_WiFi</p>
                    <p>• Password available at reception</p>
                    <p>• Maximum 3 devices per student</p>
                    <p>• No torrenting or illegal downloads</p>
                    <p>• Report connectivity issues to maintenance</p>
                  </div>
                ) : amenity.name.toLowerCase().includes('laundry') ? (
                  <div className="space-y-2">
                    <p>• Available 6:00 AM - 10:00 PM daily</p>
                    <p>• Maximum 2 hours per session</p>
                    <p>• Bring your own detergent</p>
                    <p>• Clean lint filters after use</p>
                    <p>• Report broken machines immediately</p>
                  </div>
                ) : amenity.name.toLowerCase().includes('gym') || amenity.name.toLowerCase().includes('fitness') ? (
                  <div className="space-y-2">
                    <p>• Access hours: 5:00 AM - 11:00 PM</p>
                    <p>• Wipe down equipment after use</p>
                    <p>• Proper athletic attire required</p>
                    <p>• No food or drinks except water</p>
                    <p>• Maximum 90 minutes during peak hours</p>
                  </div>
                ) : amenity.name.toLowerCase().includes('study') ? (
                  <div className="space-y-2">
                    <p>• Quiet study environment maintained</p>
                    <p>• No phone calls or loud conversations</p>
                    <p>• Clean up after use</p>
                    <p>• Maximum 4 hours per session</p>
                    <p>• Reservations available online</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p>• Follow building rules and regulations</p>
                    <p>• Respect other residents</p>
                    <p>• Report any issues to management</p>
                    <p>• Keep area clean and tidy</p>
                    <p>• Use responsibly and considerately</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Statistics & Quick Actions */}
        <div className="space-y-6">
          {/* Usage Statistics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Usage Statistics</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Rooms</span>
                <span className="text-2xl font-bold text-blue-600">{stats.totalRooms}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Buildings</span>
                <span className="text-2xl font-bold text-green-600">{stats.buildingCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Availability</span>
                <span className={`text-2xl font-bold ${amenity.is_available ? 'text-green-600' : 'text-red-600'}`}>
                  {amenity.is_available ? '100%' : '0%'}
                </span>
              </div>
              
              {/* Utilization Chart */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Utilization Rate</span>
                  <span>{stats.utilizationRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.utilizationRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Amenity Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Status Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Current Status</span>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  amenity.is_available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {amenity.is_available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              
              <div className="pt-4 border-t border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="text-gray-900">{formatDate(amenity.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="text-gray-900">{formatDateTime(amenity.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <Link
                to={`/student-hotel/amenities/${amenity.id}/edit`}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Amenity
              </Link>
              
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Usage Report
              </button>
              
              <Link
                to="/student-hotel/maintenance/create"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Report Issue
              </Link>
              
              <button 
                className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  amenity.is_available 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {amenity.is_available ? 'Mark Unavailable' : 'Mark Available'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
