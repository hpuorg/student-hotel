import { useState, useEffect } from 'react';
import { useParams, Link } from '@modern-js/runtime/router';
import { 
  SUPPORT_REQUEST_TYPES, 
  SUPPORT_REQUEST_STATUS, 
  SUPPORT_REQUEST_PRIORITY,
  SUPPORT_REQUEST_TYPE_LABELS,
  SUPPORT_REQUEST_STATUS_LABELS,
  SUPPORT_REQUEST_PRIORITY_LABELS,
  API_CONFIG 
} from '../../../../constants';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

interface Room {
  id: string;
  number: string;
  building: { name: string };
}

interface SupportRequest {
  id: string;
  user_id: string;
  room_id?: string;
  type: keyof typeof SUPPORT_REQUEST_TYPES;
  status: keyof typeof SUPPORT_REQUEST_STATUS;
  priority: keyof typeof SUPPORT_REQUEST_PRIORITY;
  title: string;
  description: string;
  response?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
  user: User;
  room?: Room;
}

export default function SupportRequestViewPage() {
  const { id } = useParams();
  const [request, setRequest] = useState<SupportRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchSupportRequest(id);
    }
  }, [id]);

  const fetchSupportRequest = async (requestId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/support-requests/${requestId}`);
      if (response.ok) {
        const data = await response.json();
        setRequest(data);
      } else if (response.status === 404) {
        setError('Support request not found');
      } else {
        // Mock data for development
        const mockRequest: SupportRequest = {
          id: requestId,
          user_id: 'u1',
          room_id: 'r1',
          type: 'MAINTENANCE',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          title: 'Air conditioning not working',
          description: 'The air conditioning unit in my room has stopped working. It was making strange noises yesterday and now it won\'t turn on at all. The room is getting very hot and uncomfortable.',
          response: 'We have received your request and our maintenance team has been notified. A technician will visit your room tomorrow morning between 9-11 AM to inspect and repair the AC unit.',
          created_at: '2024-02-15T14:30:00Z',
          updated_at: '2024-02-15T16:45:00Z',
          user: {
            id: 'u1',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@student.hpu.edu.vn',
            phone: '+84 123 456 789'
          },
          room: {
            id: 'r1',
            number: '101',
            building: { name: 'Building A' }
          }
        };
        setRequest(mockRequest);
      }
    } catch (error) {
      setError('Failed to load support request details');
      console.error('Error fetching support request:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: keyof typeof SUPPORT_REQUEST_STATUS) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: keyof typeof SUPPORT_REQUEST_PRIORITY) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: keyof typeof SUPPORT_REQUEST_TYPES) => {
    switch (type) {
      case 'MAINTENANCE': return '🔧';
      case 'CLEANING': return '🧹';
      case 'NOISE_COMPLAINT': return '🔇';
      case 'SECURITY': return '🔒';
      case 'INTERNET': return '📶';
      case 'FACILITIES': return '🏢';
      case 'OTHER': return '❓';
      default: return '❓';
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

  const getResponseTime = () => {
    if (!request) return null;
    const created = new Date(request.created_at);
    const updated = new Date(request.updated_at);
    const diffHours = Math.round((updated.getTime() - created.getTime()) / (1000 * 60 * 60));
    return diffHours;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">{error || 'Support request not found'}</div>
        <Link
          to="/student-hotel/support-requests"
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Support Requests
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
              <span className="text-2xl">{getTypeIcon(request.type)}</span>
              <h1 className="text-2xl font-bold text-gray-900">{request.title}</h1>
            </div>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(request.status)}`}>
              {SUPPORT_REQUEST_STATUS_LABELS[request.status]}
            </span>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
              {SUPPORT_REQUEST_PRIORITY_LABELS[request.priority]}
            </span>
          </div>
          <p className="text-gray-600 mt-1">
            Request #{request.id} • {SUPPORT_REQUEST_TYPE_LABELS[request.type]} • Created {formatDate(request.created_at)}
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/student-hotel/support-requests/${request.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Update Request
          </Link>
          <Link
            to="/student-hotel/support-requests"
            className="text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded-md transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Requests
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Request Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Requester Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Requester Information</h2>
            </div>
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {request.user.first_name} {request.user.last_name}
                  </h3>
                  <div className="mt-2 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {request.user.email}
                    </div>
                    {request.user.phone && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {request.user.phone}
                      </div>
                    )}
                    {request.room && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Room {request.room.number} - {request.room.building.name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/student-hotel/students/${request.user.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Request Description */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Request Description</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{request.description}</p>
            </div>
          </div>

          {/* Staff Response */}
          {request.response && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Staff Response</h2>
              </div>
              <div className="p-6">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{request.response}</p>
                  <div className="mt-3 text-sm text-gray-600">
                    Response provided on {formatDateTime(request.updated_at)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Request Timeline</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <div>
                    <div className="text-sm font-medium">Request Created</div>
                    <div className="text-xs text-gray-500">{formatDateTime(request.created_at)}</div>
                  </div>
                </div>
                
                {request.response && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <div>
                      <div className="text-sm font-medium">Staff Response Added</div>
                      <div className="text-xs text-gray-500">{formatDateTime(request.updated_at)}</div>
                    </div>
                  </div>
                )}
                
                {request.resolved_at && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <div>
                      <div className="text-sm font-medium">Request Resolved</div>
                      <div className="text-xs text-gray-500">{formatDateTime(request.resolved_at)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Request Summary & Actions */}
        <div className="space-y-6">
          {/* Request Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Request Summary</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Type</span>
                <span className="font-medium">{SUPPORT_REQUEST_TYPE_LABELS[request.type]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Priority</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                  {SUPPORT_REQUEST_PRIORITY_LABELS[request.priority]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                  {SUPPORT_REQUEST_STATUS_LABELS[request.status]}
                </span>
              </div>
              {request.room && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">Room {request.room.number}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Created</span>
                <span className="font-medium">{formatDate(request.created_at)}</span>
              </div>
              {getResponseTime() !== null && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-medium">{getResponseTime()} hours</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <Link
                to={`/student-hotel/support-requests/${request.id}/edit`}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Update Request
              </Link>
              
              {request.status !== 'RESOLVED' && (
                <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Mark as Resolved
                </button>
              )}
              
              <Link
                to={`/student-hotel/maintenance/create?room_id=${request.room_id}&description=${encodeURIComponent(request.title)}`}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Create Maintenance Request
              </Link>
              
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Update to Requester
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
