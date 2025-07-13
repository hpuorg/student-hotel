import { useState, useEffect } from 'react';
import { Link } from '@modern-js/runtime/router';
import {
  ROOM_TYPES,
  ROOM_STATUS,
  ROOM_TYPE_LABELS,
  ROOM_STATUS_LABELS,
  ROOM_TYPE_CLASSES,
  ROOM_STATUS_CLASSES,
  API_CONFIG
} from '../../../constants';

interface Room {
  id: string;
  number: string;
  building: {
    id: string;
    name: string;
    address: string;
  };
  floor: number;
  type: keyof typeof ROOM_TYPES;
  status: keyof typeof ROOM_STATUS;
  capacity: number;
  current_occupants: number;
  monthly_rate: number;
  daily_rate: number;
  area?: number;
  description?: string;
}

interface Building {
  id: string;
  name: string;
  address: string;
  floors: number;
}

interface RoomFilters {
  status: string;
  type: string;
  building_id: string;
  search_number: string;
  min_rate: string;
  max_rate: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  offset: number;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
  const [filters, setFilters] = useState<RoomFilters>({
    status: '',
    type: '',
    building_id: '',
    search_number: '',
    min_rate: '',
    max_rate: '',
  });

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    offset: 0,
  });

  // API Base URL - replace with your n8n webhook URL
  const API_BASE = 'https://your-n8n-instance.com/webhook';

  useEffect(() => {
    loadRooms();
    loadBuildings();
  }, [filters, pagination.page]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ...filters,
        limit: pagination.limit.toString(),
        offset: ((pagination.page - 1) * pagination.limit).toString(),
        sort_by: 'created_at',
        sort_order: 'desc',
        include_amenities: 'true',
        include_assets: 'false',
      });

      // Remove empty filters
      Object.keys(queryParams).forEach(key => {
        if (!queryParams.get(key)) {
          queryParams.delete(key);
        }
      });

      const response = await fetch(`${API_BASE}/rooms?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setRooms(data.data.data || []);
        setPagination(prev => ({
          ...prev,
          total: data.data.pagination.total,
          totalPages: data.data.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error('Error loading rooms:', error);
      // For demo purposes, use mock data
      setRooms([
        {
          id: '1',
          number: 'A101',
          building: { id: '1', name: 'Building A', address: '123 Main St' },
          floor: 1,
          type: 'DOUBLE',
          status: 'AVAILABLE',
          capacity: 2,
          current_occupants: 0,
          monthly_rate: 1200,
          daily_rate: 50,
          area: 25,
          description: 'Spacious double room with modern amenities'
        },
        {
          id: '2',
          number: 'A102',
          building: { id: '1', name: 'Building A', address: '123 Main St' },
          floor: 1,
          type: 'SINGLE',
          status: 'OCCUPIED',
          capacity: 1,
          current_occupants: 1,
          monthly_rate: 800,
          daily_rate: 35,
          area: 15,
          description: 'Cozy single room'
        }
      ]);
      setPagination(prev => ({ ...prev, total: 2, totalPages: 1 }));
    } finally {
      setLoading(false);
    }
  };

  const loadBuildings = async () => {
    try {
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
    }
  };

  const handleFilterChange = (key: keyof RoomFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const getRoomTypeClass = (type: string) => {
    const classes = {
      SINGLE: 'bg-blue-100 text-blue-800',
      DOUBLE: 'bg-green-100 text-green-800',
      TRIPLE: 'bg-yellow-100 text-yellow-800',
      QUAD: 'bg-purple-100 text-purple-800',
      DORMITORY: 'bg-indigo-100 text-indigo-800',
      SUITE: 'bg-pink-100 text-pink-800',
    };
    return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  };

  const getRoomStatusClass = (status: string) => {
    const classes = {
      AVAILABLE: 'bg-green-100 text-green-800',
      OCCUPIED: 'bg-red-100 text-red-800',
      MAINTENANCE: 'bg-yellow-100 text-yellow-800',
      RESERVED: 'bg-blue-100 text-blue-800',
      OUT_OF_ORDER: 'bg-gray-100 text-gray-800',
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    setShowEditModal(true);
  };

  const handleDelete = async (room: Room) => {
    if (window.confirm(`Are you sure you want to delete room ${room.number}?`)) {
      try {
        const response = await fetch(`${API_BASE}/rooms/${room.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          loadRooms(); // Reload the list
        }
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };

  const nextPage = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const previousPage = () => {
    if (pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const goToPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, pagination.page - 2);
    const end = Math.min(pagination.totalPages, pagination.page + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
        <Link
          to="/student-hotel/rooms/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Room
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              value={filters.status} 
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="RESERVED">Reserved</option>
              <option value="OUT_OF_ORDER">Out of Order</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select 
              value={filters.type} 
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="SINGLE">Single</option>
              <option value="DOUBLE">Double</option>
              <option value="TRIPLE">Triple</option>
              <option value="QUAD">Quad</option>
              <option value="DORMITORY">Dormitory</option>
              <option value="SUITE">Suite</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
            <select 
              value={filters.building_id} 
              onChange={(e) => handleFilterChange('building_id', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Buildings</option>
              {buildings.map(building => (
                <option key={building.id} value={building.id}>{building.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
            <input 
              type="text" 
              value={filters.search_number} 
              onChange={(e) => handleFilterChange('search_number', e.target.value)}
              placeholder="Search room..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Rate</label>
            <input 
              type="number" 
              value={filters.min_rate} 
              onChange={(e) => handleFilterChange('min_rate', e.target.value)}
              placeholder="Min rate"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Rate</label>
            <input 
              type="number" 
              value={filters.max_rate} 
              onChange={(e) => handleFilterChange('max_rate', e.target.value)}
              placeholder="Max rate"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Rooms List</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Building</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rooms.map((room) => (
                    <tr key={room.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{room.number}</div>
                        <div className="text-sm text-gray-500">Floor {room.floor}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{room.building?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{room.building?.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoomTypeClass(room.type)}`}>
                          {room.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoomStatusClass(room.status)}`}>
                          {room.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {room.current_occupants || 0}/{room.capacity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(room.monthly_rate)}/month
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(room)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(room)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={previousPage}
                  disabled={pagination.page <= 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={nextPage}
                  disabled={pagination.page >= pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={previousPage}
                      disabled={pagination.page <= 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === pagination.page
                            ? 'bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={nextPage}
                      disabled={pagination.page >= pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
