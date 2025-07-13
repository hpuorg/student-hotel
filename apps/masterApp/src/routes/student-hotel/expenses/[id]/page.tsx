import { useState, useEffect } from 'react';
import { useParams, Link } from '@modern-js/runtime/router';
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

interface Expense {
  id: string;
  user_id: string;
  category: keyof typeof EXPENSE_CATEGORIES;
  amount: number;
  description: string;
  vendor?: string;
  receipt?: string;
  date: string;
  status: keyof typeof EXPENSE_STATUS;
  notes?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  user: User;
}

export default function ExpenseViewPage() {
  const { id } = useParams();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchExpense(id);
    }
  }, [id]);

  const fetchExpense = async (expenseId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/expenses/${expenseId}`);
      if (response.ok) {
        const data = await response.json();
        setExpense(data);
      } else if (response.status === 404) {
        setError('Expense not found');
      } else {
        // Mock data for development
        const mockExpense: Expense = {
          id: expenseId,
          user_id: 'u1',
          category: 'MAINTENANCE',
          amount: 1500000,
          description: 'AC repair parts and labor for Room 101. Replaced compressor unit and cleaned filters.',
          vendor: 'Hai Phong HVAC Services',
          receipt: 'INV-2024-0215-001',
          date: '2024-02-15',
          status: 'APPROVED',
          notes: 'Emergency repair required due to complete AC failure. Student was relocated temporarily.',
          approved_by: 'Manager',
          approved_at: '2024-02-16T09:00:00Z',
          created_at: '2024-02-15T16:30:00Z',
          updated_at: '2024-02-16T09:00:00Z',
          user: {
            id: 'u1',
            first_name: 'Maintenance',
            last_name: 'Staff',
            email: 'maintenance@studenthotel.vn',
            role: 'STAFF'
          }
        };
        setExpense(mockExpense);
      }
    } catch (error) {
      setError('Failed to load expense details');
      console.error('Error fetching expense:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: keyof typeof EXPENSE_STATUS) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'PAID': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const getProcessingTime = () => {
    if (!expense?.approved_at) return null;
    const created = new Date(expense.created_at);
    const approved = new Date(expense.approved_at);
    const diffHours = Math.round((approved.getTime() - created.getTime()) / (1000 * 60 * 60));
    return diffHours;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">{error || 'Expense not found'}</div>
        <Link
          to="/student-hotel/expenses"
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Expenses
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
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getCategoryIcon(expense.category)}</span>
              <h1 className="text-2xl font-bold text-gray-900">Expense #{expense.id}</h1>
            </div>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(expense.status)}`}>
              {EXPENSE_STATUS_LABELS[expense.status]}
            </span>
          </div>
          <p className="text-gray-600 mt-1">
            {EXPENSE_CATEGORY_LABELS[expense.category]} • {formatCurrency(expense.amount)} • {formatDate(expense.date)}
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/student-hotel/expenses/${expense.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Expense
          </Link>
          <Link
            to="/student-hotel/expenses"
            className="text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded-md transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Expenses
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Expense Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Submitter Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Submitted By</h2>
            </div>
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {expense.user.first_name} {expense.user.last_name}
                  </h3>
                  <div className="mt-2 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {expense.user.email}
                    </div>
                    <div>Role: {expense.user.role}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expense Description */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Description</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{expense.description}</p>
            </div>
          </div>

          {/* Vendor Information */}
          {expense.vendor && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Vendor Information</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Vendor/Supplier:</span>
                    <div className="text-gray-900 mt-1">{expense.vendor}</div>
                  </div>
                  {expense.receipt && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Receipt/Invoice:</span>
                      <div className="text-gray-900 mt-1 font-mono text-sm">{expense.receipt}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {expense.notes && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Additional Notes</h2>
              </div>
              <div className="p-6">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{expense.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Approval Information */}
          {expense.approved_by && expense.approved_at && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Approval Information</h2>
              </div>
              <div className="p-6">
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <div className="text-sm text-gray-700">
                    <div>Approved by: <strong>{expense.approved_by}</strong></div>
                    <div>Approval date: {formatDateTime(expense.approved_at)}</div>
                    {getProcessingTime() !== null && (
                      <div>Processing time: {getProcessingTime()} hours</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-6">
          {/* Expense Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Expense Summary</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatCurrency(expense.amount)}
                </div>
                <div className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(expense.status)}`}>
                  {EXPENSE_STATUS_LABELS[expense.status]}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium">{EXPENSE_CATEGORY_LABELS[expense.category]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">{formatDate(expense.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Submitted</span>
                  <span className="font-medium">{formatDate(expense.created_at)}</span>
                </div>
                {expense.vendor && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vendor</span>
                    <span className="font-medium">{expense.vendor}</span>
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
              <Link
                to={`/student-hotel/expenses/${expense.id}/edit`}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Expense
              </Link>
              
              {expense.status === 'PENDING' && (
                <>
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Approve Expense
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject Expense
                  </button>
                </>
              )}
              
              {expense.status === 'APPROVED' && (
                <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
