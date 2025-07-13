import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@modern-js/runtime/router';
import { 
  EXPENSE_CATEGORIES, 
  EXPENSE_STATUS,
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_STATUS_LABELS,
  API_CONFIG 
} from '../../../../../constants';

interface ExpenseFormData {
  user_id: string;
  category: keyof typeof EXPENSE_CATEGORIES;
  amount: number;
  description: string;
  vendor: string;
  receipt: string;
  date: string;
  status: keyof typeof EXPENSE_STATUS;
  notes: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export default function EditExpensePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState<ExpenseFormData>({
    user_id: '',
    category: 'MAINTENANCE',
    amount: 0,
    description: '',
    vendor: '',
    receipt: '',
    date: new Date().toISOString().split('T')[0],
    status: 'PENDING',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      fetchExpense(id);
    }
    fetchUsers();
  }, [id]);

  const fetchExpense = async (expenseId: string) => {
    try {
      setInitialLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/expenses/${expenseId}`);
      if (response.ok) {
        const expense = await response.json();
        setFormData({
          user_id: expense.user_id || '',
          category: expense.category || 'MAINTENANCE',
          amount: expense.amount || 0,
          description: expense.description || '',
          vendor: expense.vendor || '',
          receipt: expense.receipt || '',
          date: expense.date ? expense.date.split('T')[0] : new Date().toISOString().split('T')[0],
          status: expense.status || 'PENDING',
          notes: expense.notes || '',
        });
      } else if (response.status === 404) {
        navigate('/student-hotel/expenses');
      } else {
        // Mock data for development
        setFormData({
          user_id: 'u1',
          category: 'MAINTENANCE',
          amount: 1500000,
          description: 'AC repair parts and labor for Room 101. Replaced compressor unit and cleaned filters.',
          vendor: 'Hai Phong HVAC Services',
          receipt: 'INV-2024-0215-001',
          date: '2024-02-15',
          status: 'APPROVED',
          notes: 'Emergency repair required due to complete AC failure.',
        });
      }
    } catch (error) {
      console.error('Error fetching expense:', error);
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
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const expenseDate = new Date(formData.date);
      const today = new Date();
      
      if (expenseDate > today) {
        newErrors.date = 'Expense date cannot be in the future';
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
      const response = await fetch(`${API_CONFIG.BASE_URL}/expenses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          vendor: formData.vendor || null,
          receipt: formData.receipt || null,
          notes: formData.notes || null,
        }),
      });

      if (response.ok) {
        navigate(`/student-hotel/expenses/${id}`);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Failed to update expense' });
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
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getCategoryIcon = (category: keyof typeof EXPENSE_CATEGORIES) => {
    switch (category) {
      case 'MAINTENANCE': return '🔧';
      case 'UTILITIES': return '⚡';
      case 'SUPPLIES': return '📦';
      case 'EQUIPMENT': return '🖥️';
      case 'SERVICES': return '🛎️';
      case 'INSURANCE': return '🛡️';
      case 'MARKETING': return '📢';
      case 'TRAVEL': return '✈️';
      case 'OTHER': return '📝';
      default: return '📝';
    }
  };

  const getVendorSuggestions = () => {
    const suggestions: Record<string, string[]> = {
      MAINTENANCE: ['Hai Phong HVAC Services', 'City Plumbing Co.', 'ElectroFix Solutions', 'General Maintenance Ltd.'],
      UTILITIES: ['EVN Hai Phong', 'Hai Phong Water Company', 'Viettel Internet', 'FPT Telecom'],
      SUPPLIES: ['Office Depot Vietnam', 'Cleaning Supplies Co.', 'Hotel Supply Store', 'Bulk Goods Warehouse'],
      EQUIPMENT: ['Tech Solutions Vietnam', 'Furniture Plus', 'Kitchen Equipment Co.', 'Security Systems Ltd.'],
      SERVICES: ['Professional Cleaning', 'Security Guard Services', 'Landscaping Co.', 'Waste Management'],
      INSURANCE: ['Bao Viet Insurance', 'PVI Insurance', 'Prudential Vietnam', 'AIA Vietnam'],
      MARKETING: ['Digital Marketing Agency', 'Print Shop Vietnam', 'Social Media Co.', 'Advertising Solutions'],
      TRAVEL: ['Vietnam Airlines', 'Grab Vietnam', 'Hotel Booking Co.', 'Travel Agency'],
      OTHER: ['Miscellaneous Vendor', 'Local Supplier', 'Service Provider', 'General Contractor']
    };
    return suggestions[formData.category] || [];
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Expense</h1>
          <p className="text-gray-600">Update expense details and information</p>
        </div>
        <button
          onClick={() => navigate(`/student-hotel/expenses/${id}`)}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Expense
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Expense Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Submitted By *
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
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(EXPENSE_CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {getCategoryIcon(key as keyof typeof EXPENSE_CATEGORIES)} {label}
                    </option>
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
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
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
                  {Object.entries(EXPENSE_STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Vendor Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vendor Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vendor/Supplier
                </label>
                <input
                  type="text"
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Vendor name"
                  list="vendor-suggestions"
                />
                <datalist id="vendor-suggestions">
                  {getVendorSuggestions().map((vendor, index) => (
                    <option key={index} value={vendor} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Receipt/Invoice Number
                </label>
                <input
                  type="text"
                  name="receipt"
                  value={formData.receipt}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="INV-2024-001"
                />
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
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Detailed description of the expense..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes or comments..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/student-hotel/expenses/${id}`)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
