import { useState, useEffect } from 'react';
import { useNavigate } from '@modern-js/runtime/router';
import { 
  EXPENSE_CATEGORIES, 
  EXPENSE_STATUS,
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_STATUS_LABELS,
  API_CONFIG 
} from '../../../../constants';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

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

export default function CreateExpensePage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ExpenseFormData>({
    user_id: '',
    category: 'OTHER',
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
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/users?role=STAFF,ADMIN`);
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
      newErrors.user_id = 'Please select who submitted this expense';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 5) {
      newErrors.description = 'Description must be at least 5 characters';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (formData.amount > 100000000) {
      newErrors.amount = 'Amount seems too large, please verify';
    }

    if (!formData.date) {
      newErrors.date = 'Expense date is required';
    } else {
      const expenseDate = new Date(formData.date);
      const today = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);
      
      if (expenseDate > today) {
        newErrors.date = 'Expense date cannot be in the future';
      } else if (expenseDate < oneYearAgo) {
        newErrors.date = 'Expense date cannot be more than 1 year ago';
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
      const response = await fetch(`${API_CONFIG.BASE_URL}/expenses`, {
        method: 'POST',
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
        navigate('/student-hotel/expenses');
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Failed to create expense' });
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

  const getCommonVendors = (category: keyof typeof EXPENSE_CATEGORIES) => {
    switch (category) {
      case 'MAINTENANCE': return ['Hai Phong Plumbing Services', 'ABC Electrical', 'Quick Fix Maintenance'];
      case 'UTILITIES': return ['EVN Hai Phong', 'Hai Phong Water Company', 'Viettel Internet'];
      case 'SUPPLIES': return ['Clean Pro Supplies', 'Office Depot Vietnam', 'Metro Cash & Carry'];
      case 'EQUIPMENT': return ['Equipment Plus', 'Tech Solutions VN', 'Furniture World'];
      case 'SERVICES': return ['Security Services VN', 'Cleaning Company Ltd', 'Laundry Express'];
      case 'INSURANCE': return ['Bao Viet Insurance', 'PVI Insurance', 'Prudential Vietnam'];
      case 'MARKETING': return ['Digital Marketing VN', 'Print Shop Plus', 'Social Media Agency'];
      case 'TRAVEL': return ['Vietnam Airlines', 'Grab Vietnam', 'Hotel Booking VN'];
      default: return [];
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Record New Expense</h1>
          <p className="text-gray-600">Add a new expense to the system</p>
        </div>
        <button
          onClick={() => navigate('/student-hotel/expenses')}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Expenses
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
            {/* Submitted By */}
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
                <option value="">Select staff member</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} - {user.role}
                  </option>
                ))}
              </select>
              {errors.user_id && (
                <p className="mt-1 text-sm text-red-600">{errors.user_id}</p>
              )}
            </div>

            {/* Category */}
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

            {/* Amount */}
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
                placeholder="0"
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

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expense Date *
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

            {/* Vendor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor/Supplier
              </label>
              <input
                type="text"
                name="vendor"
                value={formData.vendor}
                onChange={handleInputChange}
                list="vendor-suggestions"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Company or person paid"
              />
              <datalist id="vendor-suggestions">
                {getCommonVendors(formData.category).map((vendor) => (
                  <option key={vendor} value={vendor} />
                ))}
              </datalist>
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
                {Object.entries(EXPENSE_STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
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
              placeholder="Detailed description of the expense..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Receipt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Receipt/Invoice Reference
            </label>
            <input
              type="text"
              name="receipt"
              value={formData.receipt}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Receipt number, invoice ID, or file reference"
            />
            <p className="mt-1 text-sm text-gray-500">
              Reference to receipt or invoice document
            </p>
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
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional information or justification..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/student-hotel/expenses')}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Expense'}
            </button>
          </div>
        </form>
      </div>

      {/* Expense Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-blue-800 font-medium mb-2">Expense Recording Guidelines</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <div>• <strong>Receipts:</strong> Always keep original receipts and reference them here</div>
          <div>• <strong>Approval:</strong> Expenses over ₫5,000,000 require manager approval</div>
          <div>• <strong>Categories:</strong> Choose the most appropriate category for reporting</div>
          <div>• <strong>Timing:</strong> Record expenses within 30 days of occurrence</div>
          <div>• <strong>Description:</strong> Be specific about what was purchased and why</div>
        </div>
      </div>
    </div>
  );
}
