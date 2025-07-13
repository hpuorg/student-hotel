import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@modern-js/runtime/router';
import { 
  CONTRACT_STATUS,
  CONTRACT_STATUS_LABELS,
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
  monthly_rate: number;
  building: {
    name: string;
  };
}

interface ContractFormData {
  user_id: string;
  room_id: string;
  booking_id: string;
  contract_number: string;
  status: keyof typeof CONTRACT_STATUS;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  deposit_amount: number;
  terms_and_conditions: string;
  signed_at: string;
  terminated_at: string;
  notes: string;
}

export default function EditContractPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState<ContractFormData>({
    user_id: '',
    room_id: '',
    booking_id: '',
    contract_number: '',
    status: 'DRAFT',
    start_date: '',
    end_date: '',
    monthly_rent: 0,
    deposit_amount: 0,
    terms_and_conditions: '',
    signed_at: '',
    terminated_at: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      fetchContract(id);
    }
    fetchUsers();
    fetchRooms();
  }, [id]);

  const fetchContract = async (contractId: string) => {
    try {
      setInitialLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/contracts/${contractId}`);
      if (response.ok) {
        const contract = await response.json();
        setFormData({
          user_id: contract.user_id || '',
          room_id: contract.room_id || '',
          booking_id: contract.booking_id || '',
          contract_number: contract.contract_number || '',
          status: contract.status || 'DRAFT',
          start_date: contract.start_date ? contract.start_date.split('T')[0] : '',
          end_date: contract.end_date ? contract.end_date.split('T')[0] : '',
          monthly_rent: contract.monthly_rent || 0,
          deposit_amount: contract.deposit_amount || 0,
          terms_and_conditions: contract.terms_and_conditions || '',
          signed_at: contract.signed_at ? contract.signed_at.split('T')[0] : '',
          terminated_at: contract.terminated_at ? contract.terminated_at.split('T')[0] : '',
          notes: contract.notes || '',
        });
      } else if (response.status === 404) {
        navigate('/student-hotel/contracts');
      } else {
        // Mock data for development
        setFormData({
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
          signed_at: '2024-01-25',
          terminated_at: '',
          notes: 'Student has excellent references from previous accommodation',
        });
      }
    } catch (error) {
      console.error('Error fetching contract:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/users?role=STUDENT`);
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.user_id) {
      newErrors.user_id = 'Please select a tenant';
    }

    if (!formData.room_id) {
      newErrors.room_id = 'Please select a room';
    }

    if (!formData.contract_number.trim()) {
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

    if (formData.deposit_amount < 0) {
      newErrors.deposit_amount = 'Deposit amount cannot be negative';
    }

    if (!formData.terms_and_conditions.trim()) {
      newErrors.terms_and_conditions = 'Terms and conditions are required';
    }

    if (formData.status === 'ACTIVE' && !formData.signed_at) {
      newErrors.signed_at = 'Signed date is required for active contracts';
    }

    if (formData.status === 'TERMINATED' && !formData.terminated_at) {
      newErrors.terminated_at = 'Termination date is required for terminated contracts';
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
      const response = await fetch(`${API_CONFIG.BASE_URL}/contracts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          booking_id: formData.booking_id || null,
          signed_at: formData.signed_at || null,
          terminated_at: formData.terminated_at || null,
          notes: formData.notes || null,
        }),
      });

      if (response.ok) {
        navigate(`/student-hotel/contracts/${id}`);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Failed to update contract' });
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
      [name]: name === 'monthly_rent' || name === 'deposit_amount' ? parseFloat(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoomChange = (roomId: string) => {
    const selectedRoom = rooms.find(r => r.id === roomId);
    if (selectedRoom) {
      setFormData(prev => ({
        ...prev,
        room_id: roomId,
        monthly_rent: selectedRoom.monthly_rate,
      }));
    }
  };

  const generateContractNumber = () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const contractNumber = `CT-${year}${month}-${random}`;
    setFormData(prev => ({ ...prev, contract_number: contractNumber }));
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Contract</h1>
          <p className="text-gray-600">Update contract details and terms</p>
        </div>
        <button
          onClick={() => navigate(`/student-hotel/contracts/${id}`)}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Contract
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Number *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="contract_number"
                    value={formData.contract_number}
                    onChange={handleInputChange}
                    className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.contract_number ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="CT-2024-001"
                  />
                  <button
                    type="button"
                    onClick={generateContractNumber}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Generate
                  </button>
                </div>
                {errors.contract_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.contract_number}</p>
                )}
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
                  {Object.entries(CONTRACT_STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tenant *
                </label>
                <select
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.user_id ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select tenant</option>
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
                  Room *
                </label>
                <select
                  name="room_id"
                  value={formData.room_id}
                  onChange={(e) => handleRoomChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.room_id ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select room</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      Room {room.number} - {room.building.name} ({new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.monthly_rate)})
                    </option>
                  ))}
                </select>
                {errors.room_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.room_id}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contract Period */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contract Period</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
          </div>

          {/* Financial Terms */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Terms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  step="100000"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.monthly_rent ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.monthly_rent && (
                  <p className="mt-1 text-sm text-red-600">{errors.monthly_rent}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Security Deposit (VND) *
                </label>
                <input
                  type="number"
                  name="deposit_amount"
                  value={formData.deposit_amount}
                  onChange={handleInputChange}
                  min="0"
                  step="100000"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.deposit_amount ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.deposit_amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.deposit_amount}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contract Dates */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contract Status Dates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Signed Date {formData.status === 'ACTIVE' && '*'}
                </label>
                <input
                  type="date"
                  name="signed_at"
                  value={formData.signed_at}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.signed_at ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.signed_at && (
                  <p className="mt-1 text-sm text-red-600">{errors.signed_at}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Terminated Date {formData.status === 'TERMINATED' && '*'}
                </label>
                <input
                  type="date"
                  name="terminated_at"
                  value={formData.terminated_at}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.terminated_at ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.terminated_at && (
                  <p className="mt-1 text-sm text-red-600">{errors.terminated_at}</p>
                )}
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terms and Conditions *
            </label>
            <textarea
              name="terms_and_conditions"
              value={formData.terms_and_conditions}
              onChange={handleInputChange}
              rows={12}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.terms_and_conditions ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter the complete terms and conditions of the contract..."
            />
            {errors.terms_and_conditions && (
              <p className="mt-1 text-sm text-red-600">{errors.terms_and_conditions}</p>
            )}
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
              placeholder="Additional notes about the contract..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/student-hotel/contracts/${id}`)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Contract'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
