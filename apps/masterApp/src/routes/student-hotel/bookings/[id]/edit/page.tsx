import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@modern-js/runtime/router';
import { 
  BOOKING_TYPES, 
  BOOKING_STATUS, 
  BOOKING_TYPE_LABELS,
  BOOKING_STATUS_LABELS,
  API_CONFIG 
} from '../../../../../constants';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
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
  };
}

interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  type: keyof typeof BOOKING_TYPES;
  status: keyof typeof BOOKING_STATUS;
  check_in_date: string;
  check_out_date: string;
  actual_check_in?: string;
  actual_check_out?: string;
  guests: number;
  total_amount: number;
  notes?: string;
  user: User;
  room: Room;
}

interface BookingFormData {
  user_id: string;
  room_id: string;
  type: keyof typeof BOOKING_TYPES;
  status: keyof typeof BOOKING_STATUS;
  check_in_date: string;
  check_out_date: string;
  actual_check_in: string;
  actual_check_out: string;
  guests: number;
  notes: string;
}

export default function EditBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    user_id: '',
    room_id: '',
    type: 'SHORT_TERM',
    status: 'PENDING',
    check_in_date: '',
    check_out_date: '',
    actual_check_in: '',
    actual_check_out: '',
    guests: 1,
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      fetchBooking(id);
      fetchUsers();
      fetchRooms();
    }
  }, [id]);

  const fetchBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/bookings/${bookingId}`);
      if (response.ok) {
        const data = await response.json();
        setBooking(data);
        setFormData({
          user_id: data.user_id,
          room_id: data.room_id,
          type: data.type,
          status: data.status,
          check_in_date: data.check_in_date.split('T')[0],
          check_out_date: data.check_out_date.split('T')[0],
          actual_check_in: data.actual_check_in ? data.actual_check_in.split('T')[0] : '',
          actual_check_out: data.actual_check_out ? data.actual_check_out.split('T')[0] : '',
          guests: data.guests,
          notes: data.notes || '',
        });
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
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

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/rooms`);
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const calculateTotalAmount = () => {
    const selectedRoom = rooms.find(room => room.id === formData.room_id);
    if (!selectedRoom || !formData.check_in_date || !formData.check_out_date) {
      return booking?.total_amount || 0;
    }

    const checkIn = new Date(formData.check_in_date);
    const checkOut = new Date(formData.check_out_date);
    const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    if (formData.type === 'LONG_TERM') {
      const months = Math.ceil(days / 30);
      return months * selectedRoom.monthly_rate;
    } else {
      return days * selectedRoom.daily_rate;
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.user_id) {
      newErrors.user_id = 'Please select a guest';
    }

    if (!formData.room_id) {
      newErrors.room_id = 'Please select a room';
    }

    if (!formData.check_in_date) {
      newErrors.check_in_date = 'Check-in date is required';
    }

    if (!formData.check_out_date) {
      newErrors.check_out_date = 'Check-out date is required';
    }

    if (formData.check_in_date && formData.check_out_date) {
      const checkIn = new Date(formData.check_in_date);
      const checkOut = new Date(formData.check_out_date);
      
      if (checkOut <= checkIn) {
        newErrors.check_out_date = 'Check-out date must be after check-in date';
      }
    }

    if (formData.guests < 1) {
      newErrors.guests = 'Number of guests must be at least 1';
    }

    const selectedRoom = rooms.find(room => room.id === formData.room_id);
    if (selectedRoom && formData.guests > selectedRoom.capacity) {
      newErrors.guests = `Number of guests cannot exceed room capacity (${selectedRoom.capacity})`;
    }

    // Validate actual check-in/out dates if provided
    if (formData.actual_check_in && formData.check_in_date) {
      const actualCheckIn = new Date(formData.actual_check_in);
      const plannedCheckIn = new Date(formData.check_in_date);
      if (actualCheckIn < plannedCheckIn) {
        newErrors.actual_check_in = 'Actual check-in cannot be before planned check-in date';
      }
    }

    if (formData.actual_check_out && formData.check_out_date) {
      const actualCheckOut = new Date(formData.actual_check_out);
      const plannedCheckOut = new Date(formData.check_out_date);
      if (actualCheckOut > plannedCheckOut) {
        newErrors.actual_check_out = 'Actual check-out cannot be after planned check-out date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        ...formData,
        total_amount: calculateTotalAmount(),
        actual_check_in: formData.actual_check_in || null,
        actual_check_out: formData.actual_check_out || null,
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        navigate(`/student-hotel/bookings/${id}`);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Failed to update booking' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const totalAmount = calculateTotalAmount();

  if (!booking) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Booking</h1>
          <p className="text-gray-600">Booking ID: {booking.id}</p>
        </div>
        <button
          onClick={() => navigate(`/student-hotel/bookings/${id}`)}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Details
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-red-800">{errors.submit}</div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Guest Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guest *
              </label>
              <select
                name="user_id"
                value={formData.user_id}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.user_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a guest</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} ({user.email})
                  </option>
                ))}
              </select>
              {errors.user_id && (
                <p className="mt-1 text-sm text-red-600">{errors.user_id}</p>
              )}
            </div>

            {/* Room Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room *
              </label>
              <select
                name="room_id"
                value={formData.room_id}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.room_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a room</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    Room {room.number} - {room.building.name} (Capacity: {room.capacity})
                  </option>
                ))}
              </select>
              {errors.room_id && (
                <p className="mt-1 text-sm text-red-600">{errors.room_id}</p>
              )}
            </div>

            {/* Booking Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(BOOKING_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Booking Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(BOOKING_STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Number of Guests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Guests *
              </label>
              <input
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.guests ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.guests && (
                <p className="mt-1 text-sm text-red-600">{errors.guests}</p>
              )}
            </div>

            {/* Check-in Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-in Date *
              </label>
              <input
                type="date"
                name="check_in_date"
                value={formData.check_in_date}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.check_in_date ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.check_in_date && (
                <p className="mt-1 text-sm text-red-600">{errors.check_in_date}</p>
              )}
            </div>

            {/* Check-out Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-out Date *
              </label>
              <input
                type="date"
                name="check_out_date"
                value={formData.check_out_date}
                onChange={handleInputChange}
                min={formData.check_in_date}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.check_out_date ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.check_out_date && (
                <p className="mt-1 text-sm text-red-600">{errors.check_out_date}</p>
              )}
            </div>

            {/* Actual Check-in Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actual Check-in Date
              </label>
              <input
                type="date"
                name="actual_check_in"
                value={formData.actual_check_in}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.actual_check_in ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.actual_check_in && (
                <p className="mt-1 text-sm text-red-600">{errors.actual_check_in}</p>
              )}
            </div>

            {/* Actual Check-out Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actual Check-out Date
              </label>
              <input
                type="date"
                name="actual_check_out"
                value={formData.actual_check_out}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.actual_check_out ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.actual_check_out && (
                <p className="mt-1 text-sm text-red-600">{errors.actual_check_out}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes or special requests..."
            />
          </div>

          {/* Total Amount Display */}
          {totalAmount > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="text-blue-800 font-medium">
                Updated Total Amount: {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(totalAmount)}
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/student-hotel/bookings/${id}`)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
