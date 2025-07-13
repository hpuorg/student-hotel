import { useState, useEffect } from 'react';
import { useParams, Link } from '@modern-js/runtime/router';
import { 
  USER_ROLES, 
  USER_STATUS,
  USER_ROLE_LABELS,
  USER_STATUS_LABELS,
  API_CONFIG 
} from '../../../../constants';

interface Profile {
  id: string;
  student_id?: string;
  university?: string;
  major?: string;
  year_of_study?: number;
  date_of_birth?: string;
  nationality?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  dietary_restrictions?: string;
  medical_conditions?: string;
  notes?: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: keyof typeof USER_ROLES;
  status: keyof typeof USER_STATUS;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

interface Booking {
  id: string;
  room: {
    number: string;
    building: { name: string };
  };
  status: string;
  check_in_date: string;
  check_out_date: string;
  total_amount: number;
}

interface Contract {
  id: string;
  contract_number: string;
  status: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
}

interface Payment {
  id: string;
  type: string;
  amount: number;
  status: string;
  due_date?: string;
  paid_at?: string;
}

export default function StudentViewPage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchUserData(id);
    }
  }, [id]);

  const fetchUserData = async (userId: string) => {
    try {
      setLoading(true);
      
      // Fetch user details
      const userResponse = await fetch(`${API_CONFIG.BASE_URL}/users/${userId}`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
      } else if (userResponse.status === 404) {
        setError('Student not found');
        return;
      } else {
        // Mock data for development
        const mockUser: User = {
          id: userId,
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@student.hpu.edu.vn',
          phone: '+84 123 456 789',
          role: 'STUDENT',
          status: 'ACTIVE',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
          profile: {
            id: 'p1',
            student_id: 'HPU2024001',
            university: 'Hai Phong University',
            major: 'Computer Science',
            year_of_study: 2,
            date_of_birth: '2002-05-15',
            nationality: 'Vietnamese',
            address: '123 Main Street, Hai Phong',
            emergency_contact_name: 'Jane Doe',
            emergency_contact_phone: '+84 987 654 321',
            emergency_contact_relationship: 'Mother',
            dietary_restrictions: 'Vegetarian',
            notes: 'Excellent student, very responsible'
          }
        };
        setUser(mockUser);
      }

      // Fetch related data
      await Promise.all([
        fetchBookings(userId),
        fetchContracts(userId),
        fetchPayments(userId)
      ]);

    } catch (error) {
      setError('Failed to load student details');
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async (userId: string) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/bookings?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        // Mock data
        const mockBookings: Booking[] = [
          {
            id: 'b1',
            room: { number: '101', building: { name: 'Building A' } },
            status: 'CONFIRMED',
            check_in_date: '2024-02-01',
            check_out_date: '2024-07-31',
            total_amount: 15000000
          }
        ];
        setBookings(mockBookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchContracts = async (userId: string) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/contracts?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setContracts(data);
      } else {
        // Mock data
        const mockContracts: Contract[] = [
          {
            id: 'c1',
            contract_number: 'CT-2024-001',
            status: 'ACTIVE',
            start_date: '2024-02-01',
            end_date: '2024-07-31',
            monthly_rent: 2500000
          }
        ];
        setContracts(mockContracts);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  };

  const fetchPayments = async (userId: string) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/payments?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      } else {
        // Mock data
        const mockPayments: Payment[] = [
          {
            id: 'p1',
            type: 'RENT',
            amount: 2500000,
            status: 'COMPLETED',
            due_date: '2024-02-28',
            paid_at: '2024-02-25T10:00:00Z'
          },
          {
            id: 'p2',
            type: 'DEPOSIT',
            amount: 5000000,
            status: 'PENDING',
            due_date: '2024-03-31'
          }
        ];
        setPayments(mockPayments);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const getStatusColor = (status: keyof typeof USER_STATUS) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      case 'SUSPENDED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">{error || 'Student not found'}</div>
        <Link
          to="/student-hotel/students"
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Students
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
            <h1 className="text-2xl font-bold text-gray-900">
              {user.first_name} {user.last_name}
            </h1>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(user.status)}`}>
              {USER_STATUS_LABELS[user.status]}
            </span>
            <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
              {USER_ROLE_LABELS[user.role]}
            </span>
          </div>
          <p className="text-gray-600 mt-1">
            {user.profile?.student_id && `Student ID: ${user.profile.student_id} • `}
            Registered {formatDate(user.created_at)}
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/student-hotel/students/${user.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </Link>
          <Link
            to="/student-hotel/students"
            className="text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded-md transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Students
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Contact Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {user.phone}
                      </div>
                    )}
                    {user.profile?.address && (
                      <div className="flex items-start text-gray-600">
                        <svg className="w-4 h-4 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {user.profile.address}
                      </div>
                    )}
                  </div>
                </div>
                {user.profile && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Personal Details</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      {user.profile.date_of_birth && (
                        <div>
                          <span className="font-medium">Age:</span> {calculateAge(user.profile.date_of_birth)} years old
                        </div>
                      )}
                      {user.profile.nationality && (
                        <div>
                          <span className="font-medium">Nationality:</span> {user.profile.nationality}
                        </div>
                      )}
                      {user.profile.date_of_birth && (
                        <div>
                          <span className="font-medium">Date of Birth:</span> {formatDate(user.profile.date_of_birth)}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Academic Information */}
          {user.profile && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Academic Information</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {user.profile.university && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">University:</span>
                        <div className="text-gray-900">{user.profile.university}</div>
                      </div>
                    )}
                    {user.profile.major && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Major:</span>
                        <div className="text-gray-900">{user.profile.major}</div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    {user.profile.year_of_study && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Year of Study:</span>
                        <div className="text-gray-900">Year {user.profile.year_of_study}</div>
                      </div>
                    )}
                    {user.profile.student_id && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Student ID:</span>
                        <div className="text-gray-900 font-mono">{user.profile.student_id}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Emergency Contact */}
          {user.profile?.emergency_contact_name && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Emergency Contact</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Name:</span>
                    <div className="text-gray-900">{user.profile.emergency_contact_name}</div>
                  </div>
                  {user.profile.emergency_contact_phone && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Phone:</span>
                      <div className="text-gray-900">{user.profile.emergency_contact_phone}</div>
                    </div>
                  )}
                  {user.profile.emergency_contact_relationship && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Relationship:</span>
                      <div className="text-gray-900">{user.profile.emergency_contact_relationship}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Additional Information */}
          {(user.profile?.dietary_restrictions || user.profile?.medical_conditions || user.profile?.notes) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Additional Information</h2>
              </div>
              <div className="p-6 space-y-4">
                {user.profile.dietary_restrictions && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Dietary Restrictions:</span>
                    <div className="text-gray-900 mt-1">{user.profile.dietary_restrictions}</div>
                  </div>
                )}
                {user.profile.medical_conditions && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Medical Conditions:</span>
                    <div className="text-gray-900 mt-1">{user.profile.medical_conditions}</div>
                  </div>
                )}
                {user.profile.notes && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Notes:</span>
                    <div className="text-gray-900 mt-1">{user.profile.notes}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Activity Summary */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Stats</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Bookings</span>
                <span className="font-medium">{bookings.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Contracts</span>
                <span className="font-medium">{contracts.filter(c => c.status === 'ACTIVE').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Payments</span>
                <span className="font-medium">{payments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Outstanding Amount</span>
                <span className="font-medium text-red-600">
                  {formatCurrency(payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0))}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
              <Link to={`/student-hotel/bookings?user_id=${user.id}`} className="text-blue-600 hover:text-blue-800 text-sm">
                View All
              </Link>
            </div>
            <div className="p-6">
              {bookings.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No bookings found</p>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <div>
                        <div className="font-medium text-sm">Room {booking.room.number}</div>
                        <div className="text-xs text-gray-500">{booking.room.building.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatCurrency(booking.total_amount)}</div>
                        <div className="text-xs text-gray-500">{booking.status}</div>
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
                to={`/student-hotel/bookings/create?user_id=${user.id}`}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-2-2v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6" />
                </svg>
                Create Booking
              </Link>
              <Link
                to={`/student-hotel/payments/create?user_id=${user.id}`}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Record Payment
              </Link>
              <Link
                to={`/student-hotel/support-requests/create?user_id=${user.id}`}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Create Support Request
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
