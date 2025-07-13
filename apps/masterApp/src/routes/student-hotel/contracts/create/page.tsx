import { useState, useEffect } from 'react';
import { useNavigate } from '@modern-js/runtime/router';
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
}

interface Room {
  id: string;
  number: string;
  monthly_rate: number;
  building: {
    id: string;
    name: string;
  };
}

interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  user: User;
  room: Room;
}

interface ContractFormData {
  booking_id: string;
  user_id: string;
  room_id: string;
  contract_number: string;
  status: keyof typeof CONTRACT_STATUS;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  deposit: number;
  terms: string;
}

export default function CreateContractPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ContractFormData>({
    booking_id: '',
    user_id: '',
    room_id: '',
    contract_number: '',
    status: 'DRAFT',
    start_date: '',
    end_date: '',
    monthly_rent: 0,
    deposit: 0,
    terms: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchConfirmedBookings();
    generateContractNumber();
  }, []);

  const fetchConfirmedBookings = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/bookings?status=CONFIRMED`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const generateContractNumber = () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const contractNumber = `CT-${year}${month}-${random}`;
    setFormData(prev => ({ ...prev, contract_number: contractNumber }));
  };

  const handleBookingChange = (bookingId: string) => {
    const selectedBooking = bookings.find(b => b.id === bookingId);
    if (selectedBooking) {
      setFormData(prev => ({
        ...prev,
        booking_id: bookingId,
        user_id: selectedBooking.user_id,
        room_id: selectedBooking.room_id,
        start_date: selectedBooking.check_in_date.split('T')[0],
        end_date: selectedBooking.check_out_date.split('T')[0],
        monthly_rent: selectedBooking.room.monthly_rate,
        deposit: selectedBooking.room.monthly_rate * 2, // Default to 2 months deposit
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.booking_id) {
      newErrors.booking_id = 'Please select a booking';
    }

    if (!formData.contract_number) {
      newErrors.contract_number = 'Contract number is required';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      if (endDate <= startDate) {
        newErrors.end_date = 'End date must be after start date';
      }
    }

    if (formData.monthly_rent <= 0) {
      newErrors.monthly_rent = 'Monthly rent must be greater than 0';
    }

    if (formData.deposit < 0) {
      newErrors.deposit = 'Deposit cannot be negative';
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
      const response = await fetch(`${API_CONFIG.BASE_URL}/contracts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/student-hotel/contracts');
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Failed to create contract' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'booking_id') {
      handleBookingChange(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'monthly_rent' || name === 'deposit' ? parseFloat(value) || 0 : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const selectedBooking = bookings.find(b => b.id === formData.booking_id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Contract</h1>
          <p className="text-gray-600">Generate a rental contract from a confirmed booking</p>
        </div>
        <button
          onClick={() => navigate('/student-hotel/contracts')}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Contracts
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
            {/* Booking Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Booking *
              </label>
              <select
                name="booking_id"
                value={formData.booking_id}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.booking_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Choose a confirmed booking</option>
                {bookings.map((booking) => (
                  <option key={booking.id} value={booking.id}>
                    {booking.user.first_name} {booking.user.last_name} - Room {booking.room.number} 
                    ({booking.room.building.name}) - {new Date(booking.check_in_date).toLocaleDateString()} to {new Date(booking.check_out_date).toLocaleDateString()}
                  </option>
                ))}
              </select>
              {errors.booking_id && (
                <p className="mt-1 text-sm text-red-600">{errors.booking_id}</p>
              )}
            </div>

            {/* Contract Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contract Number *
              </label>
              <input
                type="text"
                name="contract_number"
                value={formData.contract_number}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.contract_number ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="CT-2024-001"
              />
              {errors.contract_number && (
                <p className="mt-1 text-sm text-red-600">{errors.contract_number}</p>
              )}
            </div>

            {/* Status */}
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
                {Object.entries(CONTRACT_STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.start_date ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.start_date && (
                <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                min={formData.start_date}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.end_date ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.end_date && (
                <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
              )}
            </div>

            {/* Monthly Rent */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Rent (VND) *
              </label>
              <input
                type="number"
                name="monthly_rent"
                value={formData.monthly_rent}
                onChange={handleInputChange}
                min="0"
                step="1000"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.monthly_rent ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.monthly_rent && (
                <p className="mt-1 text-sm text-red-600">{errors.monthly_rent}</p>
              )}
            </div>

            {/* Deposit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deposit (VND) *
              </label>
              <input
                type="number"
                name="deposit"
                value={formData.deposit}
                onChange={handleInputChange}
                min="0"
                step="1000"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.deposit ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.deposit && (
                <p className="mt-1 text-sm text-red-600">{errors.deposit}</p>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terms and Conditions
            </label>
            <textarea
              name="terms"
              value={formData.terms}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter contract terms and conditions..."
            />
          </div>

          {/* Selected Booking Info */}
          {selectedBooking && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-blue-800 font-medium mb-2">Selected Booking Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                <div>
                  <strong>Tenant:</strong> {selectedBooking.user.first_name} {selectedBooking.user.last_name}
                </div>
                <div>
                  <strong>Email:</strong> {selectedBooking.user.email}
                </div>
                <div>
                  <strong>Room:</strong> {selectedBooking.room.number} - {selectedBooking.room.building.name}
                </div>
                <div>
                  <strong>Period:</strong> {new Date(selectedBooking.check_in_date).toLocaleDateString()} - {new Date(selectedBooking.check_out_date).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/student-hotel/contracts')}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Contract'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
