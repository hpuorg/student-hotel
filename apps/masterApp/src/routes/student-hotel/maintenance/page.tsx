import { useState, useEffect } from 'react';
import { Link } from '@modern-js/runtime/router';
import {
  MAINTENANCE_CATEGORIES,
  MAINTENANCE_REQUEST_STATUS,
  PRIORITY_LEVELS,
  MAINTENANCE_CATEGORY_LABELS,
  MAINTENANCE_REQUEST_STATUS_LABELS,
  PRIORITY_LEVEL_LABELS,
  API_CONFIG
} from '../../../constants';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Room {
  id: string;
  number: string;
  building: {
    name: string;
  };
}

interface MaintenanceRequest {
  id: string;
  user_id: string;
  room_id?: string;
  category: keyof typeof MAINTENANCE_CATEGORIES;
  status: keyof typeof MAINTENANCE_REQUEST_STATUS;
  priority: keyof typeof PRIORITY_LEVELS;
  title: string;
  description: string;
  notes?: string;
  scheduled_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  user: User;
  room?: Room;
}

export default function MaintenancePage() {
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');

  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);

  const fetchMaintenanceRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/maintenance-requests`);
      if (response.ok) {
        const data = await response.json();
        setMaintenanceRequests(data);
      } else {
        // Mock data for development
        const mockRequests: MaintenanceRequest[] = [
          {
            id: '1',
            user_id: 'u1',
            room_id: 'r1',
            category: 'ELECTRICAL',
            status: 'PENDING',
            priority: 'HIGH',
            title: 'Electrical outlet not working',
            description: 'The power outlet near the desk is not working. Need urgent repair.',
            scheduled_date: '2024-01-20',
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z',
            user: {
              id: 'u1',
              first_name: 'John',
              last_name: 'Doe',
              email: 'john.doe@student.hpu.edu.vn'
            },
            room: {
              id: 'r1',
              number: '101',
              building: { name: 'Building A' }
            }
          },
          {
            id: '2',
            user_id: 'u2',
            room_id: 'r2',
            category: 'PLUMBING',
            status: 'IN_PROGRESS',
            priority: 'MEDIUM',
            title: 'Leaky faucet in bathroom',
            description: 'The bathroom faucet has been leaking for several days.',
            notes: 'Technician assigned. Parts ordered.',
            scheduled_date: '2024-01-18',
            created_at: '2024-01-14T14:30:00Z',
            updated_at: '2024-01-16T09:00:00Z',
            user: {
              id: 'u2',
              first_name: 'Jane',
              last_name: 'Smith',
              email: 'jane.smith@student.hpu.edu.vn'
            },
            room: {
              id: 'r2',
              number: '102',
              building: { name: 'Building A' }
            }
          },
          {
            id: '3',
            user_id: 'u3',
            category: 'HVAC',
            status: 'COMPLETED',
            priority: 'LOW',
            title: 'Air conditioning filter replacement',
            description: 'Regular maintenance - replace air conditioning filters.',
            notes: 'Completed successfully. New filters installed.',
            scheduled_date: '2024-01-12',
            completed_at: '2024-01-12T15:00:00Z',
            created_at: '2024-01-10T08:00:00Z',
            updated_at: '2024-01-12T15:00:00Z',
            user: {
              id: 'u3',
              first_name: 'Mike',
              last_name: 'Johnson',
              email: 'mike.johnson@staff.hpu.edu.vn'
            }
          }
        ];
        setMaintenanceRequests(mockRequests);
      }
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = maintenanceRequests.filter(request => {
    const matchesSearch = 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.room && request.room.number.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = !statusFilter || request.status === statusFilter;
    const matchesCategory = !categoryFilter || request.category === categoryFilter;
    const matchesPriority = !priorityFilter || request.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const getStatusColor = (status: keyof typeof MAINTENANCE_REQUEST_STATUS) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      case 'ON_HOLD': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: keyof typeof PRIORITY_LEVELS) => {
    switch (priority) {
      case 'LOW': return 'bg-blue-100 text-blue-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: keyof typeof MAINTENANCE_CATEGORIES) => {
    switch (category) {
      case 'ELECTRICAL': return 'bg-yellow-100 text-yellow-800';
      case 'PLUMBING': return 'bg-blue-100 text-blue-800';
      case 'HVAC': return 'bg-green-100 text-green-800';
      case 'CLEANING': return 'bg-purple-100 text-purple-800';
      case 'FURNITURE': return 'bg-indigo-100 text-indigo-800';
      case 'APPLIANCE': return 'bg-pink-100 text-pink-800';
      case 'STRUCTURAL': return 'bg-red-100 text-red-800';
      case 'OTHER': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (scheduledDate: string, status: string | number | symbol) => {
    const statusStr = String(status);
    if (statusStr === 'COMPLETED' || statusStr === 'CANCELLED' || !scheduledDate) return false;
    return new Date(scheduledDate) < new Date();
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
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
          <p className="text-gray-600">Manage facility maintenance and repair requests</p>
        </div>
        <Link
          to="/student-hotel/maintenance/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Request
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by title, description, or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              {Object.entries(MAINTENANCE_REQUEST_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {Object.entries(MAINTENANCE_CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priorities</option>
              {Object.entries(PRIORITY_LEVEL_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setCategoryFilter('');
                setPriorityFilter('');
              }}
              className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Maintenance Requests List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled
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
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    No maintenance requests found
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.title}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {request.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.user.first_name} {request.user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{request.user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.room ? (
                        <div>
                          <div>Room {request.room.number}</div>
                          <div className="text-gray-500">{request.room.building.name}</div>
                        </div>
                      ) : (
                        'General'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(request.category)}`}>
                        {MAINTENANCE_CATEGORY_LABELS[request.category]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                        {PRIORITY_LEVEL_LABELS[request.priority]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {MAINTENANCE_REQUEST_STATUS_LABELS[request.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.scheduled_date ? (
                        <div className={isOverdue(request.scheduled_date, request.status) ? 'text-red-600 font-medium' : ''}>
                          {formatDate(request.scheduled_date)}
                          {isOverdue(request.scheduled_date, request.status) && (
                            <div className="text-xs text-red-500">Overdue</div>
                          )}
                        </div>
                      ) : (
                        'Not scheduled'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(request.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/student-hotel/maintenance/${request.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        <Link
                          to={`/student-hotel/maintenance/${request.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
