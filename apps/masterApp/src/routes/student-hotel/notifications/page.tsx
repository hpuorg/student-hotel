import { useState, useEffect } from 'react';
import { Link } from '@modern-js/runtime/router';
import { 
  NOTIFICATION_TYPES, 
  NOTIFICATION_STATUS,
  NOTIFICATION_TYPE_LABELS,
  NOTIFICATION_STATUS_LABELS,
  API_CONFIG 
} from '../../../constants';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface Notification {
  id: string;
  user_id?: string;
  type: keyof typeof NOTIFICATION_TYPES;
  title: string;
  message: string;
  status: keyof typeof NOTIFICATION_STATUS;
  sent_at?: string;
  read_at?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [recipientFilter, setRecipientFilter] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/notifications`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        // Mock data for development
        const mockNotifications: Notification[] = [
          {
            id: '1',
            user_id: 'u1',
            type: 'PAYMENT_REMINDER',
            title: 'Monthly Rent Payment Due',
            message: 'Your monthly rent payment of ₫2,500,000 is due on January 31st. Please make your payment to avoid late fees.',
            status: 'SENT',
            sent_at: '2024-01-25T09:00:00Z',
            read_at: '2024-01-25T14:30:00Z',
            created_at: '2024-01-25T09:00:00Z',
            updated_at: '2024-01-25T14:30:00Z',
            user: {
              id: 'u1',
              first_name: 'John',
              last_name: 'Doe',
              email: 'john.doe@student.hpu.edu.vn',
              role: 'STUDENT'
            }
          },
          {
            id: '2',
            user_id: 'u2',
            type: 'MAINTENANCE_UPDATE',
            title: 'Maintenance Request Completed',
            message: 'Your maintenance request for air conditioning repair in Room 102 has been completed. Please check and confirm the issue is resolved.',
            status: 'SENT',
            sent_at: '2024-01-24T16:00:00Z',
            created_at: '2024-01-24T16:00:00Z',
            updated_at: '2024-01-24T16:00:00Z',
            user: {
              id: 'u2',
              first_name: 'Jane',
              last_name: 'Smith',
              email: 'jane.smith@student.hpu.edu.vn',
              role: 'STUDENT'
            }
          },
          {
            id: '3',
            type: 'SYSTEM_ANNOUNCEMENT',
            title: 'Scheduled Maintenance Notice',
            message: 'The building water system will undergo maintenance on January 30th from 8:00 AM to 12:00 PM. Water service may be temporarily interrupted.',
            status: 'SCHEDULED',
            created_at: '2024-01-23T10:00:00Z',
            updated_at: '2024-01-23T10:00:00Z'
          },
          {
            id: '4',
            user_id: 'u3',
            type: 'BOOKING_CONFIRMATION',
            title: 'Room Booking Confirmed',
            message: 'Your booking for Room 105 from February 1st to July 31st has been confirmed. Welcome to our student accommodation!',
            status: 'SENT',
            sent_at: '2024-01-22T11:00:00Z',
            read_at: '2024-01-22T11:15:00Z',
            created_at: '2024-01-22T11:00:00Z',
            updated_at: '2024-01-22T11:15:00Z',
            user: {
              id: 'u3',
              first_name: 'Mike',
              last_name: 'Johnson',
              email: 'mike.johnson@student.hpu.edu.vn',
              role: 'STUDENT'
            }
          },
          {
            id: '5',
            user_id: 'u4',
            type: 'EMERGENCY_ALERT',
            title: 'Fire Drill Announcement',
            message: 'A fire drill will be conducted tomorrow at 2:00 PM. Please evacuate the building when you hear the alarm and gather at the designated assembly point.',
            status: 'DRAFT',
            created_at: '2024-01-21T15:00:00Z',
            updated_at: '2024-01-21T15:00:00Z',
            user: {
              id: 'u4',
              first_name: 'Sarah',
              last_name: 'Wilson',
              email: 'sarah.wilson@student.hpu.edu.vn',
              role: 'STUDENT'
            }
          }
        ];
        setNotifications(mockNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (notification.user && 
        (notification.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         notification.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         notification.user.email.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesType = !typeFilter || notification.type === typeFilter;
    const matchesStatus = !statusFilter || notification.status === statusFilter;
    const matchesRecipient = !recipientFilter || notification.user_id === recipientFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesRecipient;
  });

  const getStatusColor = (status: keyof typeof NOTIFICATION_STATUS) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'SENT': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: keyof typeof NOTIFICATION_TYPES) => {
    switch (type) {
      case 'PAYMENT_REMINDER': return 'bg-yellow-100 text-yellow-800';
      case 'BOOKING_CONFIRMATION': return 'bg-green-100 text-green-800';
      case 'MAINTENANCE_UPDATE': return 'bg-orange-100 text-orange-800';
      case 'SYSTEM_ANNOUNCEMENT': return 'bg-blue-100 text-blue-800';
      case 'EMERGENCY_ALERT': return 'bg-red-100 text-red-800';
      case 'GENERAL': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: keyof typeof NOTIFICATION_TYPES) => {
    switch (type) {
      case 'PAYMENT_REMINDER': return '💰';
      case 'BOOKING_CONFIRMATION': return '✅';
      case 'MAINTENANCE_UPDATE': return '🔧';
      case 'SYSTEM_ANNOUNCEMENT': return '📢';
      case 'EMERGENCY_ALERT': return '🚨';
      case 'GENERAL': return '📝';
      default: return '📝';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getSentCount = () => {
    return filteredNotifications.filter(n => n.status === 'SENT').length;
  };

  const getReadCount = () => {
    return filteredNotifications.filter(n => n.read_at).length;
  };

  const getScheduledCount = () => {
    return filteredNotifications.filter(n => n.status === 'SCHEDULED').length;
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
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Manage and send notifications to students and staff</p>
        </div>
        <Link
          to="/student-hotel/notifications/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Notification
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sent</p>
              <p className="text-2xl font-bold text-gray-900">{getSentCount()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Read</p>
              <p className="text-2xl font-bold text-gray-900">{getReadCount()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">{getScheduledCount()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{filteredNotifications.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by title, message, or recipient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {Object.entries(NOTIFICATION_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              {Object.entries(NOTIFICATION_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
            <select
              value={recipientFilter}
              onChange={(e) => setRecipientFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Recipients</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('');
                setStatusFilter('');
                setRecipientFilter('');
              }}
              className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Read
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredNotifications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No notifications found
                  </td>
                </tr>
              ) : (
                filteredNotifications.map((notification) => (
                  <tr key={notification.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {notification.message}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(notification.type)}`}>
                        {NOTIFICATION_TYPE_LABELS[notification.type]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {notification.user ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {notification.user.first_name} {notification.user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{notification.user.email}</div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">All users</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(notification.status)}`}>
                        {NOTIFICATION_STATUS_LABELS[notification.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {notification.sent_at ? formatDateTime(notification.sent_at) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {notification.read_at ? (
                        <div className="text-green-600">
                          ✓ {formatDateTime(notification.read_at)}
                        </div>
                      ) : notification.sent_at ? (
                        <div className="text-gray-500">Unread</div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/student-hotel/notifications/${notification.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        <Link
                          to={`/student-hotel/notifications/${notification.id}/edit`}
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
