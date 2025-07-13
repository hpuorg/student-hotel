import { useState, useEffect } from 'react';
import { useParams, Link } from '@modern-js/runtime/router';
import { 
  PAYMENT_TYPES, 
  PAYMENT_STATUS, 
  PAYMENT_METHODS,
  PAYMENT_TYPE_LABELS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  API_CONFIG 
} from '../../../../constants';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  profile?: {
    student_id?: string;
    university?: string;
  };
}

interface Contract {
  id: string;
  contract_number: string;
  monthly_rent: number;
  room: {
    number: string;
    building: { name: string };
  };
}

interface Booking {
  id: string;
  room: {
    number: string;
    building: { name: string };
  };
  check_in_date: string;
  check_out_date: string;
}

interface Payment {
  id: string;
  user_id: string;
  booking_id?: string;
  contract_id?: string;
  type: keyof typeof PAYMENT_TYPES;
  status: keyof typeof PAYMENT_STATUS;
  method: keyof typeof PAYMENT_METHODS;
  amount: number;
  description: string;
  reference?: string;
  due_date?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
  user: User;
  contract?: Contract;
  booking?: Booking;
}

export default function PaymentViewPage() {
  const { id } = useParams();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPayment(id);
    }
  }, [id]);

  const fetchPayment = async (paymentId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/payments/${paymentId}`);
      if (response.ok) {
        const data = await response.json();
        setPayment(data);
      } else if (response.status === 404) {
        setError('Payment not found');
      } else {
        // Mock data for development
        const mockPayment: Payment = {
          id: paymentId,
          user_id: 'u1',
          contract_id: 'c1',
          booking_id: 'b1',
          type: 'RENT',
          status: 'COMPLETED',
          method: 'BANK_TRANSFER',
          amount: 2500000,
          description: 'Monthly rent payment for February 2024',
          reference: 'PAY-202402-001',
          due_date: '2024-02-01',
          paid_at: '2024-01-30T15:30:00Z',
          created_at: '2024-01-25T10:00:00Z',
          updated_at: '2024-01-30T15:30:00Z',
          user: {
            id: 'u1',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@student.hpu.edu.vn',
            phone: '+84 123 456 789',
            profile: {
              student_id: 'HPU2024001',
              university: 'Hai Phong University'
            }
          },
          contract: {
            id: 'c1',
            contract_number: 'CT-2024-001',
            monthly_rent: 2500000,
            room: {
              number: '101',
              building: { name: 'Building A' }
            }
          },
          booking: {
            id: 'b1',
            room: {
              number: '101',
              building: { name: 'Building A' }
            },
            check_in_date: '2024-02-01T14:00:00Z',
            check_out_date: '2024-07-31T11:00:00Z'
          }
        };
        setPayment(mockPayment);
      }
    } catch (error) {
      setError('Failed to load payment details');
      console.error('Error fetching payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: keyof typeof PAYMENT_STATUS) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      case 'REFUNDED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: keyof typeof PAYMENT_TYPES) => {
    switch (type) {
      case 'RENT': return 'bg-blue-100 text-blue-800';
      case 'DEPOSIT': return 'bg-green-100 text-green-800';
      case 'UTILITIES': return 'bg-yellow-100 text-yellow-800';
      case 'MAINTENANCE': return 'bg-orange-100 text-orange-800';
      case 'LATE_FEE': return 'bg-red-100 text-red-800';
      case 'REFUND': return 'bg-purple-100 text-purple-800';
      case 'OTHER': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const isOverdue = () => {
    if (!payment?.due_date || payment.status === 'COMPLETED') return false;
    return new Date(payment.due_date) < new Date();
  };

  const getDaysOverdue = () => {
    if (!payment?.due_date || payment.status === 'COMPLETED') return 0;
    const dueDate = new Date(payment.due_date);
    const today = new Date();
    const diffTime = today.getTime() - dueDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">{error || 'Payment not found'}</div>
        <Link
          to="/student-hotel/payments"
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Payments
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
            <h1 className="text-2xl font-bold text-gray-900">Payment #{payment.id}</h1>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(payment.status)}`}>
              {PAYMENT_STATUS_LABELS[payment.status]}
            </span>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getTypeColor(payment.type)}`}>
              {PAYMENT_TYPE_LABELS[payment.type]}
            </span>
          </div>
          <p className="text-gray-600 mt-1">
            {payment.reference && `Reference: ${payment.reference} • `}
            Created {formatDate(payment.created_at)}
          </p>
          {isOverdue() && (
            <div className="mt-2 flex items-center text-red-600">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Overdue by {getDaysOverdue()} days
            </div>
          )}
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/student-hotel/payments/${payment.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Payment
          </Link>
          <Link
            to="/student-hotel/payments"
            className="text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded-md transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Payments
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Payment Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payer Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Payer Information</h2>
            </div>
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {payment.user.first_name} {payment.user.last_name}
                  </h3>
                  <div className="mt-2 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {payment.user.email}
                    </div>
                    {payment.user.phone && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {payment.user.phone}
                      </div>
                    )}
                    {payment.user.profile?.student_id && (
                      <div>Student ID: {payment.user.profile.student_id}</div>
                    )}
                    {payment.user.profile?.university && (
                      <div>University: {payment.user.profile.university}</div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/student-hotel/students/${payment.user.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Payment Details</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Payment Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium text-lg">{formatCurrency(payment.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method:</span>
                      <span className="font-medium">{PAYMENT_METHOD_LABELS[payment.method]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(payment.type)}`}>
                        {PAYMENT_TYPE_LABELS[payment.type]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {PAYMENT_STATUS_LABELS[payment.status]}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Important Dates</h3>
                  <div className="space-y-3 text-sm">
                    {payment.due_date && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Due Date:</span>
                        <span className={`font-medium ${isOverdue() ? 'text-red-600' : ''}`}>
                          {formatDate(payment.due_date)}
                        </span>
                      </div>
                    )}
                    {payment.paid_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Paid Date:</span>
                        <span className="font-medium text-green-600">
                          {formatDateTime(payment.paid_at)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">{formatDateTime(payment.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">{formatDateTime(payment.updated_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Description</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700">{payment.description}</p>
            </div>
          </div>

          {/* Related Records */}
          {(payment.contract || payment.booking) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Related Records</h2>
              </div>
              <div className="p-6 space-y-4">
                {payment.contract && (
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                    <div>
                      <div className="font-medium text-gray-900">Contract {payment.contract.contract_number}</div>
                      <div className="text-sm text-gray-600">
                        Room {payment.contract.room.number} - {payment.contract.room.building.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        Monthly Rent: {formatCurrency(payment.contract.monthly_rent)}
                      </div>
                    </div>
                    <Link
                      to={`/student-hotel/contracts/${payment.contract.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View Contract
                    </Link>
                  </div>
                )}
                {payment.booking && (
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                    <div>
                      <div className="font-medium text-gray-900">Booking #{payment.booking.id}</div>
                      <div className="text-sm text-gray-600">
                        Room {payment.booking.room.number} - {payment.booking.room.building.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(payment.booking.check_in_date)} to {formatDate(payment.booking.check_out_date)}
                      </div>
                    </div>
                    <Link
                      to={`/student-hotel/bookings/${payment.booking.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View Booking
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Payment Summary & Actions */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Payment Summary</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatCurrency(payment.amount)}
                </div>
                <div className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                  {PAYMENT_STATUS_LABELS[payment.status]}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">{PAYMENT_METHOD_LABELS[payment.method]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Type</span>
                  <span className="font-medium">{PAYMENT_TYPE_LABELS[payment.type]}</span>
                </div>
                {payment.reference && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference</span>
                    <span className="font-medium font-mono text-xs">{payment.reference}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Status Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Status Timeline</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <div>
                    <div className="text-sm font-medium">Payment Created</div>
                    <div className="text-xs text-gray-500">{formatDateTime(payment.created_at)}</div>
                  </div>
                </div>
                
                {payment.paid_at && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <div>
                      <div className="text-sm font-medium">Payment Completed</div>
                      <div className="text-xs text-gray-500">{formatDateTime(payment.paid_at)}</div>
                    </div>
                  </div>
                )}
                
                {payment.status === 'PENDING' && payment.due_date && (
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${isOverdue() ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                    <div>
                      <div className="text-sm font-medium">
                        {isOverdue() ? 'Payment Overdue' : 'Payment Due'}
                      </div>
                      <div className="text-xs text-gray-500">{formatDate(payment.due_date)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              {payment.status === 'PENDING' && (
                <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Mark as Paid
                </button>
              )}
              
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Receipt
              </button>
              
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Payment Reminder
              </button>
              
              <Link
                to={`/student-hotel/payments/create?user_id=${payment.user_id}`}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Related Payment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
