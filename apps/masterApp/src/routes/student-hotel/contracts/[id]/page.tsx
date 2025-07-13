import { useState, useEffect } from 'react';
import { useParams, Link } from '@modern-js/runtime/router';
import { 
  CONTRACT_STATUS,
  CONTRACT_STATUS_LABELS,
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

interface Room {
  id: string;
  number: string;
  type: string;
  capacity: number;
  building: {
    name: string;
    address: string;
  };
}

interface Booking {
  id: string;
  check_in_date: string;
  check_out_date: string;
  status: string;
}

interface Contract {
  id: string;
  user_id: string;
  room_id: string;
  booking_id?: string;
  contract_number: string;
  status: keyof typeof CONTRACT_STATUS;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  deposit_amount: number;
  terms_and_conditions: string;
  signed_at?: string;
  terminated_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  user: User;
  room: Room;
  booking?: Booking;
}

interface Payment {
  id: string;
  type: string;
  amount: number;
  status: string;
  due_date?: string;
  paid_at?: string;
  description: string;
}

export default function ContractViewPage() {
  const { id } = useParams();
  const [contract, setContract] = useState<Contract | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchContract(id);
      fetchPayments(id);
    }
  }, [id]);

  const fetchContract = async (contractId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/contracts/${contractId}`);
      if (response.ok) {
        const data = await response.json();
        setContract(data);
      } else if (response.status === 404) {
        setError('Contract not found');
      } else {
        // Mock data for development
        const mockContract: Contract = {
          id: contractId,
          user_id: 'u1',
          room_id: 'r1',
          booking_id: 'b1',
          contract_number: 'CT-2024-001',
          status: 'ACTIVE',
          start_date: '2024-02-01',
          end_date: '2024-07-31',
          monthly_rent: 2500000,
          deposit_amount: 5000000,
          terms_and_conditions: `STUDENT ACCOMMODATION CONTRACT

1. RENTAL TERMS
- Monthly rent: ₫2,500,000 due on the 1st of each month
- Security deposit: ₫5,000,000 (refundable upon satisfactory completion)
- Contract period: February 1, 2024 to July 31, 2024

2. TENANT RESPONSIBILITIES
- Maintain cleanliness and good condition of the room
- No smoking or alcohol consumption on premises
- Respect quiet hours (10 PM - 7 AM)
- No unauthorized guests overnight
- Report maintenance issues promptly

3. FACILITY RULES
- Access card must be carried at all times
- Common areas are shared spaces - keep clean
- Laundry facilities available 6 AM - 10 PM
- Study rooms available for booking

4. PAYMENT TERMS
- Rent due by 5th of each month
- Late payment fee: ₫100,000 after 7 days
- Utilities included in rent
- Internet access included

5. TERMINATION
- 30 days written notice required
- Early termination fee: 1 month rent
- Deposit refund within 14 days after move-out
- Room inspection required before departure`,
          signed_at: '2024-01-25T14:00:00Z',
          notes: 'Student has excellent references from previous accommodation',
          created_at: '2024-01-20T10:00:00Z',
          updated_at: '2024-01-25T14:00:00Z',
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
          room: {
            id: 'r1',
            number: '101',
            type: 'Single',
            capacity: 1,
            building: {
              name: 'Building A',
              address: '123 University Street, Hai Phong'
            }
          },
          booking: {
            id: 'b1',
            check_in_date: '2024-02-01T14:00:00Z',
            check_out_date: '2024-07-31T11:00:00Z',
            status: 'CONFIRMED'
          }
        };
        setContract(mockContract);
      }
    } catch (error) {
      setError('Failed to load contract details');
      console.error('Error fetching contract:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async (contractId: string) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/payments?contract_id=${contractId}`);
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      } else {
        // Mock data
        const mockPayments: Payment[] = [
          {
            id: 'p1',
            type: 'DEPOSIT',
            amount: 5000000,
            status: 'COMPLETED',
            paid_at: '2024-01-25T10:00:00Z',
            description: 'Security deposit payment'
          },
          {
            id: 'p2',
            type: 'RENT',
            amount: 2500000,
            status: 'COMPLETED',
            due_date: '2024-02-01',
            paid_at: '2024-01-30T15:00:00Z',
            description: 'February 2024 rent payment'
          },
          {
            id: 'p3',
            type: 'RENT',
            amount: 2500000,
            status: 'PENDING',
            due_date: '2024-03-01',
            description: 'March 2024 rent payment'
          }
        ];
        setPayments(mockPayments);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const getStatusColor = (status: keyof typeof CONTRACT_STATUS) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'EXPIRED': return 'bg-yellow-100 text-yellow-800';
      case 'TERMINATED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
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
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const calculateContractDuration = () => {
    if (!contract) return 0;
    const start = new Date(contract.start_date);
    const end = new Date(contract.end_date);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const calculateTotalValue = () => {
    if (!contract) return 0;
    const months = Math.ceil(calculateContractDuration() / 30);
    return (contract.monthly_rent * months) + contract.deposit_amount;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">{error || 'Contract not found'}</div>
        <Link
          to="/student-hotel/contracts"
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Contracts
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
            <h1 className="text-2xl font-bold text-gray-900">Contract {contract.contract_number}</h1>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(contract.status)}`}>
              {CONTRACT_STATUS_LABELS[contract.status]}
            </span>
          </div>
          <p className="text-gray-600 mt-1">
            Created {formatDate(contract.created_at)}
            {contract.signed_at && ` • Signed ${formatDate(contract.signed_at)}`}
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/student-hotel/contracts/${contract.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Contract
          </Link>
          <Link
            to="/student-hotel/contracts"
            className="text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded-md transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Contracts
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Contract Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tenant Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Tenant Information</h2>
            </div>
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {contract.user.first_name} {contract.user.last_name}
                  </h3>
                  <div className="mt-2 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {contract.user.email}
                    </div>
                    {contract.user.phone && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {contract.user.phone}
                      </div>
                    )}
                    {contract.user.profile?.student_id && (
                      <div>Student ID: {contract.user.profile.student_id}</div>
                    )}
                    {contract.user.profile?.university && (
                      <div>University: {contract.user.profile.university}</div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/student-hotel/students/${contract.user.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Property Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Property Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Room {contract.room.number}
                  </h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <div>Building: {contract.room.building.name}</div>
                    <div>Type: {contract.room.type}</div>
                    <div>Capacity: {contract.room.capacity} person(s)</div>
                    <div>Address: {contract.room.building.address}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/student-hotel/rooms/${contract.room.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View Room Details
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Terms and Conditions</h2>
            </div>
            <div className="p-6">
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                  {contract.terms_and_conditions}
                </pre>
              </div>
            </div>
          </div>

          {/* Notes */}
          {contract.notes && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700">{contract.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Contract Summary & Payments */}
        <div className="space-y-6">
          {/* Contract Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Contract Summary</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Start Date</span>
                <span className="font-medium">{formatDate(contract.start_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">End Date</span>
                <span className="font-medium">{formatDate(contract.end_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{calculateContractDuration()} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Rent</span>
                <span className="font-medium">{formatCurrency(contract.monthly_rent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Security Deposit</span>
                <span className="font-medium">{formatCurrency(contract.deposit_amount)}</span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-900 font-medium">Total Contract Value</span>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(calculateTotalValue())}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Booking */}
          {contract.booking && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Related Booking</h2>
              </div>
              <div className="p-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID</span>
                    <Link
                      to={`/student-hotel/bookings/${contract.booking.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {contract.booking.id}
                    </Link>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in</span>
                    <span>{formatDate(contract.booking.check_in_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out</span>
                    <span>{formatDate(contract.booking.check_out_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="capitalize">{contract.booking.status}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment History */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
              <Link
                to={`/student-hotel/payments/create?contract_id=${contract.id}`}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Add Payment
              </Link>
            </div>
            <div className="p-6">
              {payments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No payments recorded</p>
              ) : (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <div>
                        <div className="font-medium text-sm">{payment.description}</div>
                        <div className="text-xs text-gray-500">
                          {payment.due_date && `Due: ${formatDate(payment.due_date)}`}
                          {payment.paid_at && ` • Paid: ${formatDate(payment.paid_at)}`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatCurrency(payment.amount)}</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  ))}
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
                to={`/student-hotel/payments/create?contract_id=${contract.id}&user_id=${contract.user_id}`}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Record Payment
              </Link>
              <Link
                to={`/student-hotel/support-requests/create?user_id=${contract.user_id}&room_id=${contract.room_id}`}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Create Support Request
              </Link>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Contract PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
