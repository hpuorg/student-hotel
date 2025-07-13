import { useState, useEffect } from 'react';
import { useParams, Link } from '@modern-js/runtime/router';
import { API_CONFIG } from '../../../../constants';

interface Room {
  id: string;
  number: string;
  type: string;
  status: string;
  capacity: number;
  current_occupants: number;
  monthly_rate: number;
  daily_rate: number;
  floor: number;
  area?: number;
  description?: string;
}

interface Building {
  id: string;
  name: string;
  address: string;
  floors: number;
  description?: string;
  created_at: string;
  updated_at: string;
  rooms: Room[];
}

export default function BuildingViewPage() {
  const { id } = useParams();
  const [building, setBuilding] = useState<Building | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchBuilding(id);
    }
  }, [id]);

  const fetchBuilding = async (buildingId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/buildings/${buildingId}`);
      if (response.ok) {
        const data = await response.json();
        setBuilding(data);
      } else if (response.status === 404) {
        setError('Building not found');
      } else {
        // Mock data for development
        const mockBuilding: Building = {
          id: buildingId,
          name: 'Building A',
          address: '123 Main Street, University Campus, Hai Phong',
          floors: 5,
          description: 'Main student accommodation building with modern facilities including high-speed internet, laundry facilities, common areas, and 24/7 security.',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
          rooms: [
            {
              id: 'r1',
              number: 'A101',
              type: 'DOUBLE',
              status: 'AVAILABLE',
              capacity: 2,
              current_occupants: 0,
              monthly_rate: 1200000,
              daily_rate: 50000,
              floor: 1,
              area: 25.5,
              description: 'Spacious double room with private bathroom'
            },
            {
              id: 'r2',
              number: 'A102',
              type: 'SINGLE',
              status: 'OCCUPIED',
              capacity: 1,
              current_occupants: 1,
              monthly_rate: 800000,
              daily_rate: 35000,
              floor: 1,
              area: 18.0,
              description: 'Cozy single room with study area'
            },
            {
              id: 'r3',
              number: 'A201',
              type: 'TRIPLE',
              status: 'MAINTENANCE',
              capacity: 3,
              current_occupants: 0,
              monthly_rate: 1500000,
              daily_rate: 60000,
              floor: 2,
              area: 35.0,
              description: 'Large triple room with balcony'
            },
            {
              id: 'r4',
              number: 'A202',
              type: 'DOUBLE',
              status: 'RESERVED',
              capacity: 2,
              current_occupants: 0,
              monthly_rate: 1200000,
              daily_rate: 50000,
              floor: 2,
              area: 25.5,
              description: 'Standard double room'
            },
            {
              id: 'r5',
              number: 'A301',
              type: 'SUITE',
              status: 'AVAILABLE',
              capacity: 4,
              current_occupants: 0,
              monthly_rate: 2000000,
              daily_rate: 80000,
              floor: 3,
              area: 45.0,
              description: 'Luxury suite with kitchenette and living area'
            }
          ]
        };
        setBuilding(mockBuilding);
      }
    } catch (error) {
      setError('Failed to load building details');
      console.error('Error fetching building:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoomStats = () => {
    if (!building?.rooms) return { total: 0, available: 0, occupied: 0, maintenance: 0, reserved: 0 };
    
    const total = building.rooms.length;
    const available = building.rooms.filter(r => r.status === 'AVAILABLE').length;
    const occupied = building.rooms.filter(r => r.status === 'OCCUPIED').length;
    const maintenance = building.rooms.filter(r => r.status === 'MAINTENANCE').length;
    const reserved = building.rooms.filter(r => r.status === 'RESERVED').length;
    
    return { total, available, occupied, maintenance, reserved };
  };

  const getOccupancyRate = () => {
    if (!building?.rooms) return 0;
    const totalCapacity = building.rooms.reduce((sum, room) => sum + room.capacity, 0);
    const currentOccupants = building.rooms.reduce((sum, room) => sum + room.current_occupants, 0);
    return totalCapacity > 0 ? Math.round((currentOccupants / totalCapacity) * 100) : 0;
  };

  const getAverageRate = () => {
    if (!building?.rooms || building.rooms.length === 0) return 0;
    const totalRate = building.rooms.reduce((sum, room) => sum + room.monthly_rate, 0);
    return Math.round(totalRate / building.rooms.length);
  };

  const getRoomsByFloor = () => {
    if (!building?.rooms) return {};
    return building.rooms.reduce((acc, room) => {
      if (!acc[room.floor]) acc[room.floor] = [];
      acc[room.floor].push(room);
      return acc;
    }, {} as Record<number, Room[]>);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800';
      case 'OCCUPIED': return 'bg-red-100 text-red-800';
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800';
      case 'RESERVED': return 'bg-blue-100 text-blue-800';
      case 'OUT_OF_ORDER': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SINGLE': return 'bg-blue-100 text-blue-800';
      case 'DOUBLE': return 'bg-green-100 text-green-800';
      case 'TRIPLE': return 'bg-yellow-100 text-yellow-800';
      case 'QUAD': return 'bg-purple-100 text-purple-800';
      case 'SUITE': return 'bg-pink-100 text-pink-800';
      case 'DORMITORY': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !building) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">{error || 'Building not found'}</div>
        <Link
          to="/student-hotel/buildings"
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Buildings
        </Link>
      </div>
    );
  }

  const roomStats = getRoomStats();
  const occupancyRate = getOccupancyRate();
  const averageRate = getAverageRate();
  const roomsByFloor = getRoomsByFloor();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <Link
              to="/student-hotel/buildings"
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{building.name}</h1>
          </div>
          <p className="text-gray-600">{building.address}</p>
        </div>
        
        <div className="flex space-x-3">
          <Link
            to={`/student-hotel/buildings/${building.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Building
          </Link>
          <Link
            to="/student-hotel/rooms/create"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Room
          </Link>
        </div>
      </div>

      {/* Building Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Floors</p>
              <p className="text-2xl font-semibold text-gray-900">{building.floors}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Rooms</p>
              <p className="text-2xl font-semibold text-gray-900">{roomStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Occupancy Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{occupancyRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Monthly Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(averageRate)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Building Details and Room Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Building Information */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Building Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Description</label>
              <p className="mt-1 text-sm text-gray-900">{building.description || 'No description available'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Created</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(building.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(building.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Room Statistics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Room Status</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Available</span>
              <span className="text-sm font-medium text-green-600">{roomStats.available}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Occupied</span>
              <span className="text-sm font-medium text-red-600">{roomStats.occupied}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Reserved</span>
              <span className="text-sm font-medium text-blue-600">{roomStats.reserved}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Maintenance</span>
              <span className="text-sm font-medium text-yellow-600">{roomStats.maintenance}</span>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">Total Rooms</span>
                <span className="text-sm font-bold text-gray-900">{roomStats.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rooms by Floor */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Rooms by Floor</h2>
          <Link
            to={`/student-hotel/rooms?building_id=${building.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All Rooms →
          </Link>
        </div>
        <div className="p-6">
          {Object.keys(roomsByFloor)
            .sort((a, b) => Number(a) - Number(b))
            .map((floor) => (
              <div key={floor} className="mb-8 last:mb-0">
                <h3 className="text-md font-medium text-gray-900 mb-4">
                  Floor {floor} ({roomsByFloor[Number(floor)].length} rooms)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roomsByFloor[Number(floor)].map((room) => (
                    <div key={room.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{room.number}</h4>
                          <div className="flex space-x-2 mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(room.type)}`}>
                              {room.type}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                              {room.status}
                            </span>
                          </div>
                        </div>
                        <Link
                          to={`/student-hotel/rooms/${room.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M7 7l10 10M17 7l-10 10" />
                          </svg>
                        </Link>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Capacity:</span>
                          <span>{room.current_occupants}/{room.capacity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly Rate:</span>
                          <span className="font-medium">{formatCurrency(room.monthly_rate)}</span>
                        </div>
                        {room.area && (
                          <div className="flex justify-between">
                            <span>Area:</span>
                            <span>{room.area} m²</span>
                          </div>
                        )}
                        {room.description && (
                          <p className="text-xs text-gray-500 mt-2">{room.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
