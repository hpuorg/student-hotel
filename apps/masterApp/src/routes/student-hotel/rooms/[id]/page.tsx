import { useState, useEffect } from 'react';
import { useParams, Link } from '@modern-js/runtime/router';
import { 
  ROOM_TYPES, 
  ROOM_STATUS, 
  ROOM_TYPE_LABELS, 
  ROOM_STATUS_LABELS,
  ROOM_TYPE_CLASSES,
  ROOM_STATUS_CLASSES,
  API_CONFIG 
} from '../../../../constants';

interface Building {
  id: string;
  name: string;
  address: string;
  floors: number;
}

interface Amenity {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  quantity: number;
}

interface Asset {
  id: string;
  name: string;
  category: string;
  status: string;
  condition: string;
  serial_number?: string;
  purchase_date?: string;
}

interface Booking {
  id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  check_in_date: string;
  check_out_date: string;
  status: string;
  type: string;
}

interface Room {
  id: string;
  number: string;
  building: Building;
  floor: number;
  type: keyof typeof ROOM_TYPES;
  status: keyof typeof ROOM_STATUS;
  capacity: number;
  current_occupants: number;
  monthly_rate: number;
  daily_rate: number;
  area?: number;
  description?: string;
  created_at: string;
  updated_at: string;
  amenities: Amenity[];
  assets: Asset[];
  current_bookings: Booking[];
}

export default function RoomViewPage() {
  const { id } = useParams();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchRoom(id);
    }
  }, [id]);

  const fetchRoom = async (roomId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/rooms/${roomId}`);
      if (response.ok) {
        const data = await response.json();
        setRoom(data);
      } else if (response.status === 404) {
        setError('Room not found');
      } else {
        // Mock data for development
        const mockRoom: Room = {
          id: roomId,
          number: 'A101',
          building: {
            id: 'b1',
            name: 'Building A',
            address: '123 Main Street, University Campus',
            floors: 5
          },
          floor: 1,
          type: 'DOUBLE',
          status: 'AVAILABLE',
          capacity: 2,
          current_occupants: 0,
          monthly_rate: 1200000,
          daily_rate: 50000,
          area: 25.5,
          description: 'Spacious double room with private bathroom, study area, and balcony overlooking the campus garden.',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
          amenities: [
            {
              id: 'a1',
              name: 'Wi-Fi Internet',
              description: 'High-speed wireless internet',
              icon: '📶',
              quantity: 1
            },
            {
              id: 'a2',
              name: 'Air Conditioning',
              description: 'Climate control system',
              icon: '❄️',
              quantity: 1
            },
            {
              id: 'a3',
              name: 'Study Desk',
              description: 'Wooden study desk with chair',
              icon: '🪑',
              quantity: 2
            }
          ],
          assets: [
            {
              id: 'as1',
              name: 'Bed Frame',
              category: 'FURNITURE',
              status: 'ACTIVE',
              condition: 'GOOD',
              serial_number: 'BF-A101-001'
            },
            {
              id: 'as2',
              name: 'Air Conditioner',
              category: 'APPLIANCES',
              status: 'ACTIVE',
              condition: 'EXCELLENT',
              serial_number: 'AC-A101-001',
              purchase_date: '2024-01-01'
            }
          ],
          current_bookings: []
        };
        setRoom(mockRoom);
      }
    } catch (error) {
      setError('Failed to load room details');
      console.error('Error fetching room:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getOccupancyPercentage = () => {
    if (!room || room.capacity === 0) return 0;
    return Math.round((room.current_occupants / room.capacity) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">{error || 'Room not found'}</div>
        <Link
          to="/student-hotel/rooms"
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Rooms
        </Link>
      </div>
    );
  }

  const occupancyPercentage = getOccupancyPercentage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <Link
              to="/student-hotel/rooms"
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Room {room.number}</h1>
            <div className="flex space-x-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${ROOM_TYPE_CLASSES[room.type]}`}>
                {ROOM_TYPE_LABELS[room.type]}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${ROOM_STATUS_CLASSES[room.status]}`}>
                {ROOM_STATUS_LABELS[room.status]}
              </span>
            </div>
          </div>
          <p className="text-gray-600">{room.building.name} - Floor {room.floor}</p>
        </div>
        
        <div className="flex space-x-3">
          <Link
            to={`/student-hotel/rooms/${room.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Room
          </Link>
          <Link
            to="/student-hotel/bookings/create"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3z" />
            </svg>
            Book Room
          </Link>
        </div>
      </div>

      {/* Room Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Occupancy</p>
              <p className="text-2xl font-semibold text-gray-900">{room.current_occupants}/{room.capacity}</p>
              <p className="text-xs text-gray-500">{occupancyPercentage}% occupied</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Monthly Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(room.monthly_rate)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Daily Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(room.daily_rate)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Area</p>
              <p className="text-2xl font-semibold text-gray-900">{room.area || 'N/A'}</p>
              {room.area && <p className="text-xs text-gray-500">square meters</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Room Details and Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Room Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Description</label>
                <p className="mt-1 text-sm text-gray-900">{room.description || 'No description available'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Building</label>
                  <Link
                    to={`/student-hotel/buildings/${room.building.id}`}
                    className="mt-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    {room.building.name}
                  </Link>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Floor</label>
                  <p className="mt-1 text-sm text-gray-900">Floor {room.floor}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Created</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(room.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(room.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Amenities</h2>
            </div>
            <div className="p-6">
              {room.amenities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {room.amenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <div className="text-2xl">{amenity.icon || '🏠'}</div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{amenity.name}</h3>
                        {amenity.description && (
                          <p className="text-sm text-gray-500">{amenity.description}</p>
                        )}
                        {amenity.quantity > 1 && (
                          <p className="text-xs text-gray-400">Quantity: {amenity.quantity}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No amenities listed for this room</p>
              )}
            </div>
          </div>

          {/* Assets */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Assets</h2>
              <Link
                to={`/student-hotel/assets?room_id=${room.id}`}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All Assets →
              </Link>
            </div>
            <div className="p-6">
              {room.assets.length > 0 ? (
                <div className="space-y-3">
                  {room.assets.map((asset) => (
                    <div key={asset.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{asset.name}</h3>
                        <div className="flex space-x-4 text-sm text-gray-500">
                          <span>Category: {asset.category}</span>
                          <span>Status: {asset.status}</span>
                          <span>Condition: {asset.condition}</span>
                        </div>
                        {asset.serial_number && (
                          <p className="text-xs text-gray-400">S/N: {asset.serial_number}</p>
                        )}
                      </div>
                      <Link
                        to={`/student-hotel/assets/${asset.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M7 7l10 10M17 7l-10 10" />
                        </svg>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No assets assigned to this room</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <Link
                to={`/student-hotel/rooms/${room.id}/edit`}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Room
              </Link>

              <Link
                to="/student-hotel/bookings/create"
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3z" />
                </svg>
                Create Booking
              </Link>

              <Link
                to="/student-hotel/maintenance/create"
                className="w-full flex items-center justify-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Request Maintenance
              </Link>
            </div>
          </div>

          {/* Current Bookings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Current Bookings</h2>
            </div>
            <div className="p-6">
              {room.current_bookings.length > 0 ? (
                <div className="space-y-3">
                  {room.current_bookings.map((booking) => (
                    <div key={booking.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {booking.user.first_name} {booking.user.last_name}
                          </h3>
                          <p className="text-sm text-gray-500">{booking.user.email}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Link
                          to={`/student-hotel/bookings/${booking.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M7 7l10 10M17 7l-10 10" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No current bookings</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
