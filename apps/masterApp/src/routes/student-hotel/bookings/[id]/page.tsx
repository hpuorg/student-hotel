import { useState, useEffect } from 'react';
import { useParams, Link } from '@modern-js/runtime/router';
import { 
  BOOKING_STATUS_LABELS, 
  BOOKING_TYPE_LABELS,
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
  type: string;
  capacity: number;
  monthly_rate: number;
  daily_rate: number;
  building: {
    id: string;
    name: string;
    address: string;
  };
}

interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  type: string;
  status: string;
  check_in_date: string;
  check_out_date: string;
  actual_check_in?: string;
  actual_check_out?: string;
  guests: number;
  total_amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  user: User;
  room: Room;
}

export default function BookingDetailsPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBooking(id);
    }
  }, [id]);

  const fetchBooking = async (bookingId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/bookings/${bookingId}`);
      if (response.ok) {
        const data = await response.json();
        setBooking(data);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'CHECKED_IN': return 'bg-green-100 text-green-800';
      case 'CHECKED_OUT': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'NO_SHOW': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SHORT_TERM': return 'bg-purple-100 text-purple-800';
      case 'LONG_TERM': return 'bg-indigo-100 text-indigo-800';
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

  const calculateDuration = () => {
    if (!booking) return 0;
    const checkIn = new Date(booking.check_in_date);
    const checkOut = new Date(booking.check_out_date);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h2>
        <p className="text-gray-600 mb-6">The booking you're looking for doesn't exist.</p>
        <Link
          to="/student-hotel/bookings"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
          <p className="text-gray-600">Booking ID: {booking.id}</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/student-hotel/bookings/${booking.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit Booking
          </Link>
          <Link
            to="/student-hotel/bookings"
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Bookings
          </Link>
        </div>
      </div>

      {/* Status and Type Badges */}
      <div className="flex space-x-4">
        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(booking.status)}`}>
          {BOOKING_STATUS_LABELS[booking.status as keyof typeof BOOKING_STATUS_LABELS] || booking.status}
        </span>
        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getTypeColor(booking.type)}`}>
          {BOOKING_TYPE_LABELS[booking.type as keyof typeof BOOKING_TYPE_LABELS] || booking.type}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Guest Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-500">Name</label>
              <p className="text-gray-900">{booking.user.first_name} {booking.user.last_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{booking.user.email}</p>
            </div>
            {booking.user.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{booking.user.phone}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-500">Number of Guests</label>
              <p className="text-gray-900">{booking.guests}</p>
            </div>
          </div>
        </div>

        {/* Room Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Room Information</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-500">Room Number</label>
              <p className="text-gray-900">Room {booking.room.number}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Building</label>
              <p className="text-gray-900">{booking.room.building.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Address</label>
              <p className="text-gray-900">{booking.room.building.address}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Room Type</label>
              <p className="text-gray-900">{booking.room.type}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Capacity</label>
              <p className="text-gray-900">{booking.room.capacity} guests</p>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-500">Check-in Date</label>
              <p className="text-gray-900">{formatDate(booking.check_in_date)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Check-out Date</label>
              <p className="text-gray-900">{formatDate(booking.check_out_date)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Duration</label>
              <p className="text-gray-900">{calculateDuration()} days</p>
            </div>
            {booking.actual_check_in && (
              <div>
                <label className="block text-sm font-medium text-gray-500">Actual Check-in</label>
                <p className="text-gray-900">{formatDateTime(booking.actual_check_in)}</p>
              </div>
            )}
            {booking.actual_check_out && (
              <div>
                <label className="block text-sm font-medium text-gray-500">Actual Check-out</label>
                <p className="text-gray-900">{formatDateTime(booking.actual_check_out)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-500">Total Amount</label>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(booking.total_amount)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Daily Rate</label>
              <p className="text-gray-900">{formatCurrency(booking.room.daily_rate)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Monthly Rate</label>
              <p className="text-gray-900">{formatCurrency(booking.room.monthly_rate)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {booking.notes && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{booking.notes}</p>
        </div>
      )}

      {/* Timestamps */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking History</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Created At</label>
            <p className="text-gray-900">{formatDateTime(booking.created_at)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Last Updated</label>
            <p className="text-gray-900">{formatDateTime(booking.updated_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
