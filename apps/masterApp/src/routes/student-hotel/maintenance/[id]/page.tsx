import { useState, useEffect } from 'react';
import { useParams, Link } from '@modern-js/runtime/router';
import { 
  MAINTENANCE_CATEGORIES, 
  MAINTENANCE_STATUS, 
  MAINTENANCE_PRIORITY,
  MAINTENANCE_CATEGORY_LABELS,
  MAINTENANCE_STATUS_LABELS,
  MAINTENANCE_PRIORITY_LABELS,
  API_CONFIG 
} from '../../../../constants';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Room {
  id: string;
  number: string;
  building: { name: string };
}

interface MaintenanceRequest {
  id: string;
  user_id?: string;
  room_id?: string;
  category: keyof typeof MAINTENANCE_CATEGORIES;
  status: keyof typeof MAINTENANCE_STATUS;
  priority: keyof typeof MAINTENANCE_PRIORITY;
  title: string;
  description: string;
  estimated_cost?: number;
  actual_cost?: number;
  scheduled_date?: string;
  completed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  room?: Room;
}

export default function MaintenanceViewPage() {
  const { id } = useParams();
  const [maintenance, setMaintenance] = useState<MaintenanceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchMaintenance(id);
    }
  }, [id]);

  const fetchMaintenance = async (maintenanceId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/maintenance/${maintenanceId}`);
      if (response.ok) {
        const data = await response.json();
        setMaintenance(data);
      } else if (response.status === 404) {
        setError('Maintenance request not found');
      } else {
        // Mock data for development
        const mockMaintenance: MaintenanceRequest = {
          id: maintenanceId,
          user_id: 'u1',
          room_id: 'r1',
          category: 'HVAC',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          title: 'Air conditioning repair',
          description: 'AC unit in Room 101 is not cooling properly. Making strange noises and warm air coming out. Needs immediate attention as room temperature is uncomfortable for student.',
          estimated_cost: 1500000,
          actual_cost: 1200000,
          scheduled_date: '2024-02-16T09:00:00Z',
          completed_at: '2024-02-16T14:30:00Z',
          notes: 'Replaced faulty compressor and cleaned filters. System tested and working normally. Advised student to report any further issues.',
          created_at: '2024-02-15T14:30:00Z',
          updated_at: '2024-02-16T14:30:00Z',
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
        };
        setMaintenance(mockMaintenance);
      }
    } catch (error) {
      setError('Failed to load maintenance request details');
      console.error('Error fetching maintenance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: keyof typeof MAINTENANCE_STATUS) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: keyof typeof MAINTENANCE_PRIORITY) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: keyof typeof MAINTENANCE_CATEGORIES) => {
    switch (category) {
      case 'PLUMBING': return '🚰';
      case 'ELECTRICAL': return '⚡';
      case 'HVAC': return '❄️';
      case 'APPLIANCE': return '🔌';
      case 'FURNITURE': return '🪑';
      case 'CLEANING': return '🧹';
      case 'SECURITY': return '🔒';
      case 'OTHER': return '🔧';
      default: return '🔧';
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getCompletionTime = () => {
    if (!maintenance?.completed_at) return null;
    const created = new Date(maintenance.created_at);
    const completed = new Date(maintenance.completed_at);
    const diffHours = Math.round((completed.getTime() - created.getTime()) / (1000 * 60 * 60));
    return diffHours;
  };

  const isOverdue = () => {
    if (!maintenance?.scheduled_date || maintenance.status === 'COMPLETED') return false;
    return new Date(maintenance.scheduled_date) < new Date();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !maintenance) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">{error || 'Maintenance request not found'}</div>
        <Link
          to="/student-hotel/maintenance"
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Maintenance
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getCategoryIcon(maintenance.category)}</span>
              <h1 className="text-2xl font-bold text-gray-900">{maintenance.title}</h1>
            </div>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(maintenance.status)}`}>
              {MAINTENANCE_STATUS_LABELS[maintenance.status]}
            </span>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(maintenance.priority)}`}>
              {MAINTENANCE_PRIORITY_LABELS[maintenance.priority]}
            </span>
          </div>
          <p className="text-gray-600 mt-1">
            Request #{maintenance.id} • {MAINTENANCE_CATEGORY_LABELS[maintenance.category]} • Created {formatDate(maintenance.created_at)}
          </p>
          {isOverdue() && (
            <div className="mt-2 flex items-center text-red-600">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Overdue - Scheduled for {formatDateTime(maintenance.scheduled_date!)}
            </div>
          )}
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/student-hotel/maintenance/${maintenance.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Update Request
          </Link>
          <Link
            to="/student-hotel/maintenance"
            className="text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded-md transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Maintenance
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Request Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Location & Requester */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Location & Requester</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {maintenance.room && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Location</h3>
                    <div className="text-gray-700">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Room {maintenance.room.number} - {maintenance.room.building.name}
                      </div>
                      <Link
                        to={`/student-hotel/rooms/${maintenance.room.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm mt-1 inline-block"
                      >
                        View Room Details
                      </Link>
                    </div>
                  </div>
                )}
                
                {maintenance.user && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Requested By</h3>
                    <div className="text-gray-700">
                      <div>{maintenance.user.first_name} {maintenance.user.last_name}</div>
                      <div className="text-sm text-gray-600">{maintenance.user.email}</div>
                      <Link
                        to={`/student-hotel/students/${maintenance.user.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm mt-1 inline-block"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Description</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{maintenance.description}</p>
            </div>
          </div>

          {/* Work Notes */}
          {maintenance.notes && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Work Notes</h2>
              </div>
              <div className="p-6">
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{maintenance.notes}</p>
                  {maintenance.completed_at && (
                    <div className="mt-3 text-sm text-gray-600">
                      Work completed on {formatDateTime(maintenance.completed_at)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Work Timeline</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <div>
                    <div className="text-sm font-medium">Request Created</div>
                    <div className="text-xs text-gray-500">{formatDateTime(maintenance.created_at)}</div>
                  </div>
                </div>
                
                {maintenance.scheduled_date && (
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${isOverdue() ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                    <div>
                      <div className="text-sm font-medium">
                        {isOverdue() ? 'Scheduled (Overdue)' : 'Scheduled'}
                      </div>
                      <div className="text-xs text-gray-500">{formatDateTime(maintenance.scheduled_date)}</div>
                    </div>
                  </div>
                )}
                
                {maintenance.status === 'IN_PROGRESS' && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                    <div>
                      <div className="text-sm font-medium">Work In Progress</div>
                      <div className="text-xs text-gray-500">Currently being worked on</div>
                    </div>
                  </div>
                )}
                
                {maintenance.completed_at && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <div>
                      <div className="text-sm font-medium">Work Completed</div>
                      <div className="text-xs text-gray-500">{formatDateTime(maintenance.completed_at)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-6">
          {/* Request Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Request Summary</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Category</span>
                <span className="font-medium">{MAINTENANCE_CATEGORY_LABELS[maintenance.category]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Priority</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(maintenance.priority)}`}>
                  {MAINTENANCE_PRIORITY_LABELS[maintenance.priority]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(maintenance.status)}`}>
                  {MAINTENANCE_STATUS_LABELS[maintenance.status]}
                </span>
              </div>
              {maintenance.scheduled_date && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Scheduled</span>
                  <span className="font-medium">{formatDate(maintenance.scheduled_date)}</span>
                </div>
              )}
              {getCompletionTime() !== null && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Completion Time</span>
                  <span className="font-medium">{getCompletionTime()} hours</span>
                </div>
              )}
            </div>
          </div>

          {/* Cost Information */}
          {(maintenance.estimated_cost || maintenance.actual_cost) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Cost Information</h2>
              </div>
              <div className="p-6 space-y-4">
                {maintenance.estimated_cost && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Cost</span>
                    <span className="font-medium">{formatCurrency(maintenance.estimated_cost)}</span>
                  </div>
                )}
                {maintenance.actual_cost && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Actual Cost</span>
                    <span className="font-medium text-green-600">{formatCurrency(maintenance.actual_cost)}</span>
                  </div>
                )}
                {maintenance.estimated_cost && maintenance.actual_cost && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Variance</span>
                      <span className={`font-medium ${
                        maintenance.actual_cost <= maintenance.estimated_cost ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {maintenance.actual_cost <= maintenance.estimated_cost ? '-' : '+'}
                        {formatCurrency(Math.abs(maintenance.actual_cost - maintenance.estimated_cost))}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <Link
                to={`/student-hotel/maintenance/${maintenance.id}/edit`}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Update Request
              </Link>
              
              {maintenance.status !== 'COMPLETED' && (
                <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Mark as Completed
                </button>
              )}
              
              <Link
                to={`/student-hotel/expenses/create?description=${encodeURIComponent(maintenance.title)}&amount=${maintenance.actual_cost || maintenance.estimated_cost || 0}`}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Record Expense
              </Link>
              
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generate Work Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
