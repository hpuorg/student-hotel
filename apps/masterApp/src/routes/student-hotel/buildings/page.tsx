import { useState, useEffect } from 'react';
import { Link } from '@modern-js/runtime/router';

interface Building {
  id: string;
  name: string;
  address: string;
  floors: number;
  description?: string;
  rooms?: Room[];
  created_at?: string;
  updated_at?: string;
}

interface Room {
  id: string;
  number: string;
  type: string;
  status: string;
  capacity: number;
  current_occupants: number;
  monthly_rate: number;
}

interface BuildingFilters {
  search_name: string;
  org_id: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  offset: number;
}

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  
  const [filters, setFilters] = useState<BuildingFilters>({
    search_name: '',
    org_id: 'hpu.edu.vn',
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
    loadBuildings();
  }, [filters, pagination.page]);

  const loadBuildings = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ...filters,
        limit: pagination.limit.toString(),
        offset: ((pagination.page - 1) * pagination.limit).toString(),
        sort_field: 'created_at',
        sort_direction: 'desc',
        include_rooms: 'true',
      });

      // Remove empty filters
      Object.keys(queryParams).forEach(key => {
        if (!queryParams.get(key) || queryParams.get(key) === '') {
          queryParams.delete(key);
        }
      });

      const response = await fetch(`${API_BASE}/buildings?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setBuildings(data.data.data || []);
        setPagination(prev => ({
          ...prev,
          total: data.data.pagination.total,
          totalPages: data.data.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error('Error loading buildings:', error);
      // For demo purposes, use mock data
      setBuildings([
        {
          id: '1',
          name: 'Building A',
          address: '123 Main Street, University Campus',
          floors: 5,
          description: 'Main student accommodation building with modern facilities',
          rooms: [
            { id: '1', number: 'A101', type: 'DOUBLE', status: 'AVAILABLE', capacity: 2, current_occupants: 0, monthly_rate: 1200 },
            { id: '2', number: 'A102', type: 'SINGLE', status: 'OCCUPIED', capacity: 1, current_occupants: 1, monthly_rate: 800 },
          ]
        },
        {
          id: '2',
          name: 'Building B',
          address: '456 Oak Avenue, University Campus',
          floors: 4,
          description: 'Secondary building with suite-style accommodations',
          rooms: [
            { id: '3', number: 'B201', type: 'SUITE', status: 'AVAILABLE', capacity: 4, current_occupants: 0, monthly_rate: 2000 },
            { id: '4', number: 'B202', type: 'TRIPLE', status: 'MAINTENANCE', capacity: 3, current_occupants: 0, monthly_rate: 1500 },
          ]
        }
      ]);
      setPagination(prev => ({ ...prev, total: 2, totalPages: 1 }));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof BuildingFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleEdit = (building: Building) => {
    setSelectedBuilding(building);
    setShowEditModal(true);
  };

  const handleDelete = async (building: Building) => {
    if (window.confirm(`Are you sure you want to delete ${building.name}? This will also delete all rooms in this building.`)) {
      try {
        const response = await fetch(`${API_BASE}/buildings/${building.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          loadBuildings(); // Reload the list
        }
      } catch (error) {
        console.error('Error deleting building:', error);
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

  const getRoomStats = (rooms: Room[] = []) => {
    const total = rooms.length;
    const available = rooms.filter(r => r.status === 'AVAILABLE').length;
    const occupied = rooms.filter(r => r.status === 'OCCUPIED').length;
    const maintenance = rooms.filter(r => r.status === 'MAINTENANCE').length;
    
    return { total, available, occupied, maintenance };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Building Management</h1>
        <Link
          to="/student-hotel/buildings/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Building
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Building Name</label>
            <input 
              type="text" 
              value={filters.search_name} 
              onChange={(e) => handleFilterChange('search_name', e.target.value)}
              placeholder="Search buildings..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
            <input 
              type="text" 
              value={filters.org_id} 
              onChange={(e) => handleFilterChange('org_id', e.target.value)}
              placeholder="Organization ID"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Buildings Grid */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Buildings List</h3>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {buildings.map((building) => {
                const roomStats = getRoomStats(building.rooms);
                return (
                  <div key={building.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{building.name}</h3>
                        <p className="text-sm text-gray-500">{building.address}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(building)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(building)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {building.floors} floors
                      </div>

                      {building.description && (
                        <p className="text-sm text-gray-600">{building.description}</p>
                      )}

                      {/* Room Statistics */}
                      <div className="border-t pt-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Room Statistics</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Total:</span>
                            <span className="font-medium">{roomStats.total}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-600">Available:</span>
                            <span className="font-medium text-green-600">{roomStats.available}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-red-600">Occupied:</span>
                            <span className="font-medium text-red-600">{roomStats.occupied}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-yellow-600">Maintenance:</span>
                            <span className="font-medium text-yellow-600">{roomStats.maintenance}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3">
                        <Link
                          to={`/student-hotel/rooms?building_id=${building.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Rooms →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
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
