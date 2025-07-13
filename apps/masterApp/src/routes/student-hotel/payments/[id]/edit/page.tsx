import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@modern-js/runtime/router';
import { 
  PAYMENT_TYPES, 
  PAYMENT_STATUS, 
  PAYMENT_METHODS,
  PAYMENT_TYPE_LABELS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  API_CONFIG 
} from '../../../../../constants';

interface PaymentFormData {
  user_id: string;
  booking_id: string;
  contract_id: string;
  type: keyof typeof PAYMENT_TYPES;
  status: keyof typeof PAYMENT_STATUS;
  method: keyof typeof PAYMENT_METHODS;
  amount: number;
  description: string;
  reference: string;
  due_date: string;
  paid_at: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Contract {
  id: string;
  contract_number: string;
  monthly_rent: number;
}

interface Booking {
  id: string;
  total_amount: number;
}

export default function EditPaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState<PaymentFormData>({
    user_id: '',
    booking_id: '',
    contract_id: '',
    type: 'RENT',
    status: 'PENDING',
    method: 'BANK_TRANSFER',
    amount: 0,
    description: '',
    reference: '',
    due_date: '',
    paid_at: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      fetchPayment(id);
    }
    fetchUsers();
    fetchContracts();
    fetchBookings();
  }, [id]);

  const fetchPayment = async (paymentId: string) => {
    try {
      setInitialLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/payments/${paymentId}`);
      if (response.ok) {
        const payment = await response.json();
        setFormData({
          user_id: payment.user_id || '',
          booking_id: payment.booking_id || '',
          contract_id: payment.contract_id || '',
          type: payment.type || 'RENT',
          status: payment.status || 'PENDING',
          method: payment.method || 'BANK_TRANSFER',
          amount: payment.amount || 0,
          description: payment.description || '',
          reference: payment.reference || '',
          due_date: payment.due_date ? payment.due_date.split('T')[0] : '',
          paid_at: payment.paid_at ? payment.paid_at.split('T')[0] : '',
        });
      } else if (response.status === 404) {
        navigate('/student-hotel/payments');
      } else {
        // Mock data for development
        setFormData({
          user_id: 'u1',
          booking_id: 'b1',
          contract_id: 'c1',
          type: 'RENT',
          status: 'COMPLETED',
          method: 'BANK_TRANSFER',
          amount: 2500000,
          description: 'Monthly rent payment for February 2024',
          reference: 'PAY-202402-001',
          due_date: '2024-02-01',
          paid_at: '2024-01-30',
        });
      }
    } catch (error) {
      console.error('Error fetching payment:', error);
    } finally {
      setInitialLoading(false);
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

  const fetchContracts = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/contracts`);
      if (response.ok) {
        const data = await response.json();
        setContracts(data);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/bookings`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.user_id) {
      newErrors.user_id = 'Please select a user';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.due_date) {
      const dueDate = new Date(formData.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today && formData.status === 'PENDING') {
        newErrors.due_date = 'Due date cannot be in the past for pending payments';
      }
    }

    if (formData.status === 'COMPLETED' && !formData.paid_at) {
      newErrors.paid_at = 'Paid date is required for completed payments';
    }

    if (formData.paid_at && formData.due_date) {
      const paidDate = new Date(formData.paid_at);
      const dueDate = new Date(formData.due_date);
      
      if (paidDate < dueDate && formData.status === 'COMPLETED') {
        // This is actually okay - early payment
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
      const response = await fetch(`${API_CONFIG.BASE_URL}/payments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          booking_id: formData.booking_id || null,
          contract_id: formData.contract_id || null,
          reference: formData.reference || null,
          due_date: formData.due_date || null,
          paid_at: formData.paid_at || null,
        }),
      });

      if (response.ok) {
        navigate(`/student-hotel/payments/${id}`);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Failed to update payment' });
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
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
    
    // Auto-fill paid_at when status changes to COMPLETED
    if (name === 'status' && value === 'COMPLETED' && !formData.paid_at) {
      setFormData(prev => ({
        ...prev,
        status: value as keyof typeof PAYMENT_STATUS,
        paid_at: new Date().toISOString().split('T')[0]
      }));
    }
    
    // Clear paid_at when status changes from COMPLETED
    if (name === 'status' && value !== 'COMPLETED') {
      setFormData(prev => ({
        ...prev,
        status: value as keyof typeof PAYMENT_STATUS,
        paid_at: ''
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleContractChange = (contractId: string) => {
    const selectedContract = contracts.find(c => c.id === contractId);
    if (selectedContract && formData.type === 'RENT') {
      setFormData(prev => ({
        ...prev,
        contract_id: contractId,
        amount: selectedContract.monthly_rent,
        description: `Monthly rent payment - Contract ${selectedContract.contract_number}`
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        contract_id: contractId
      }));
    }
  };

  const handleBookingChange = (bookingId: string) => {
    const selectedBooking = bookings.find(b => b.id === bookingId);
    if (selectedBooking) {
      setFormData(prev => ({
        ...prev,
        booking_id: bookingId,
        amount: selectedBooking.total_amount,
        description: `Booking payment - Booking #${bookingId}`
      }));
    }
  };

  const generateReference = () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const reference = `PAY-${year}${month}-${random}`;
    setFormData(prev => ({ ...prev, reference }));
  };

  if (initialLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Payment</h1>
          <p className="text-gray-600">Update payment details and status</p>
        </div>
        <button
          onClick={() => navigate(`/student-hotel/payments/${id}`)}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Payment
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

          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User *
                </label>
                <select
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.user_id ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} - {user.email}
                    </option>
                  ))}
                </select>
                {errors.user_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.user_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(PAYMENT_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

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
                  {Object.entries(PAYMENT_STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <select
                  name="method"
                  value={formData.method}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(PAYMENT_METHOD_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (VND) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  min="0"
                  step="1000"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.amount ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                )}
                {formData.amount > 0 && (
                  <p className="mt-1 text-sm text-gray-500">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(formData.amount)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Number
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="reference"
                    value={formData.reference}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="PAY-202401-001"
                  />
                  <button
                    type="button"
                    onClick={generateReference}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Records */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Records</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract (Optional)
                </label>
                <select
                  name="contract_id"
                  value={formData.contract_id}
                  onChange={(e) => handleContractChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select contract</option>
                  {contracts.map((contract) => (
                    <option key={contract.id} value={contract.id}>
                      {contract.contract_number} ({new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(contract.monthly_rent)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking (Optional)
                </label>
                <select
                  name="booking_id"
                  value={formData.booking_id}
                  onChange={(e) => handleBookingChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select booking</option>
                  {bookings.map((booking) => (
                    <option key={booking.id} value={booking.id}>
                      Booking #{booking.id} ({new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.total_amount)})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Important Dates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.due_date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.due_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paid Date {formData.status === 'COMPLETED' && '*'}
                </label>
                <input
                  type="date"
                  name="paid_at"
                  value={formData.paid_at}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.paid_at ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.paid_at && (
                  <p className="mt-1 text-sm text-red-600">{errors.paid_at}</p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Payment description..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/student-hotel/payments/${id}`)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
