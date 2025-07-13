import { useState, useEffect } from 'react';
import { useParams, Link } from '@modern-js/runtime/router';
import { 
  NOTIFICATION_TYPES, 
  NOTIFICATION_STATUS,
  NOTIFICATION_TYPE_LABELS,
  NOTIFICATION_STATUS_LABELS,
  API_CONFIG 
} from '../../../../constants';

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
  recipient_type: 'individual' | 'all' | 'role';
  recipient_role?: string;
  scheduled_for?: string;
  sent_at?: string;
  read_at?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  recipient_count?: number;
  read_count?: number;
}

export default function NotificationViewPage() {
  const { id } = useParams();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchNotification(id);
    }
  }, [id]);

  const fetchNotification = async (notificationId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/notifications/${notificationId}`);
      if (response.ok) {
        const data = await response.json();
        setNotification(data);
      } else if (response.status === 404) {
        setError('Notification not found');
      } else {
        // Mock data for development
        const mockNotification: Notification = {
          id: notificationId,
          user_id: 'u1',
          type: 'PAYMENT_REMINDER',
          title: 'Monthly Rent Payment Reminder',
          message: `Dear Students,

This is a friendly reminder that your monthly rent payment for March 2024 is due on March 1st, 2024.

Payment Details:
• Amount: ₫2,500,000
• Due Date: March 1, 2024
• Late Fee: ₫100,000 (applied after March 5th)

Payment Methods:
1. Bank Transfer to Account: 1234567890 (Vietcombank)
2. Cash payment at the reception desk
3. Online payment through our student portal

Please ensure your payment is completed by the due date to avoid any late fees. If you have any questions or need assistance with payment, please contact our office.

Thank you for your cooperation.

Best regards,
Student Hotel Management Team`,
          status: 'SENT',
          recipient_type: 'role',
          recipient_role: 'STUDENT',
          sent_at: '2024-02-25T09:00:00Z',
          created_at: '2024-02-24T16:00:00Z',
          updated_at: '2024-02-25T09:00:00Z',
          user: {
            id: 'u1',
            first_name: 'Admin',
            last_name: 'User',
            email: 'admin@studenthotel.vn',
            role: 'ADMIN'
          },
          recipient_count: 45,
          read_count: 32
        };
        setNotification(mockNotification);
      }
    } catch (error) {
      setError('Failed to load notification details');
      console.error('Error fetching notification:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: keyof typeof NOTIFICATION_STATUS) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'SENT': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
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

  const getRecipientDescription = () => {
    if (!notification) return '';
    
    switch (notification.recipient_type) {
      case 'individual':
        return notification.user ? `${notification.user.first_name} ${notification.user.last_name}` : 'Individual User';
      case 'role':
        return `All ${notification.recipient_role} users`;
      case 'all':
        return 'All users';
      default:
        return 'Unknown';
    }
  };

  const getReadRate = () => {
    if (!notification?.recipient_count || !notification?.read_count) return 0;
    return Math.round((notification.read_count / notification.recipient_count) * 100);
  };

  const isScheduled = () => {
    return notification?.status === 'SCHEDULED' && notification?.scheduled_for;
  };

  const isOverdue = () => {
    if (!isScheduled()) return false;
    return new Date(notification!.scheduled_for!) < new Date();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !notification) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">{error || 'Notification not found'}</div>
        <Link
          to="/student-hotel/notifications"
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Notifications
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
              <span className="text-2xl">{getTypeIcon(notification.type)}</span>
              <h1 className="text-2xl font-bold text-gray-900">{notification.title}</h1>
            </div>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(notification.status)}`}>
              {NOTIFICATION_STATUS_LABELS[notification.status]}
            </span>
          </div>
          <p className="text-gray-600 mt-1">
            {NOTIFICATION_TYPE_LABELS[notification.type]} • {getRecipientDescription()} • Created {formatDate(notification.created_at)}
          </p>
          {isScheduled() && (
            <div className={`mt-2 flex items-center ${isOverdue() ? 'text-red-600' : 'text-blue-600'}`}>
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {isOverdue() ? 'Overdue - ' : 'Scheduled for '}
              {formatDateTime(notification.scheduled_for!)}
            </div>
          )}
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/student-hotel/notifications/${notification.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Notification
          </Link>
          <Link
            to="/student-hotel/notifications"
            className="text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded-md transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Notifications
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Notification Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sender Information */}
          {notification.user && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Sent By</h2>
              </div>
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {notification.user.first_name} {notification.user.last_name}
                    </h3>
                    <div className="mt-2 space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {notification.user.email}
                      </div>
                      <div>Role: {notification.user.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Message Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Message Content</h2>
            </div>
            <div className="p-6">
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                  {notification.message}
                </pre>
              </div>
            </div>
          </div>

          {/* Delivery Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Delivery Timeline</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <div>
                    <div className="text-sm font-medium">Notification Created</div>
                    <div className="text-xs text-gray-500">{formatDateTime(notification.created_at)}</div>
                  </div>
                </div>
                
                {notification.scheduled_for && (
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${isOverdue() ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                    <div>
                      <div className="text-sm font-medium">
                        {isOverdue() ? 'Scheduled (Overdue)' : 'Scheduled for Delivery'}
                      </div>
                      <div className="text-xs text-gray-500">{formatDateTime(notification.scheduled_for)}</div>
                    </div>
                  </div>
                )}
                
                {notification.sent_at && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <div>
                      <div className="text-sm font-medium">Notification Sent</div>
                      <div className="text-xs text-gray-500">{formatDateTime(notification.sent_at)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-6">
          {/* Notification Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Notification Summary</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="text-3xl mb-2">{getTypeIcon(notification.type)}</div>
                <div className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(notification.status)}`}>
                  {NOTIFICATION_STATUS_LABELS[notification.status]}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium">{NOTIFICATION_TYPE_LABELS[notification.type]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recipients</span>
                  <span className="font-medium">{getRecipientDescription()}</span>
                </div>
                {notification.recipient_count && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Sent</span>
                    <span className="font-medium">{notification.recipient_count}</span>
                  </div>
                )}
                {notification.read_count !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Read Count</span>
                    <span className="font-medium">{notification.read_count}</span>
                  </div>
                )}
                {notification.recipient_count && notification.read_count !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Read Rate</span>
                    <span className="font-medium">{getReadRate()}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Statistics */}
          {notification.recipient_count && notification.read_count !== undefined && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Delivery Statistics</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Read Rate</span>
                      <span>{getReadRate()}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getReadRate()}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{notification.read_count}</div>
                      <div className="text-xs text-gray-600">Read</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-400">
                        {notification.recipient_count - notification.read_count}
                      </div>
                      <div className="text-xs text-gray-600">Unread</div>
                    </div>
                  </div>
                </div>
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
                to={`/student-hotel/notifications/${notification.id}/edit`}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Notification
              </Link>
              
              {notification.status === 'DRAFT' && (
                <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send Now
                </button>
              )}
              
              {notification.status === 'SCHEDULED' && (
                <button className="w-full flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel Scheduled
                </button>
              )}
              
              <Link
                to={`/student-hotel/notifications/create?template=${notification.type}&title=${encodeURIComponent(notification.title)}`}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Duplicate Notification
              </Link>
              
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
