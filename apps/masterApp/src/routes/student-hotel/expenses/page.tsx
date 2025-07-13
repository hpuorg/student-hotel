import { useState, useEffect } from 'react';
import { Link } from '@modern-js/runtime/router';
import { 
  EXPENSE_CATEGORIES, 
  EXPENSE_STATUS,
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_STATUS_LABELS,
  API_CONFIG 
} from '../../../constants';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
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
  approved_by?: string;
  approved_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  user: User;
  approver?: User;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/expenses`);
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      } else {
        // Mock data for development
        const mockExpenses: Expense[] = [
          {
            id: '1',
            user_id: 'u1',
            category: 'MAINTENANCE',
            amount: 2500000,
            description: 'Plumbing repair for Room 101',
            vendor: 'Hai Phong Plumbing Services',
            receipt: 'receipt_001.pdf',
            date: '2024-01-15',
            status: 'APPROVED',
            approved_by: 'u2',
            approved_at: '2024-01-16T10:00:00Z',
            created_at: '2024-01-15T14:30:00Z',
            updated_at: '2024-01-16T10:00:00Z',
            user: {
              id: 'u1',
              first_name: 'John',
              last_name: 'Doe',
              email: 'john.doe@staff.hpu.edu.vn'
            },
            approver: {
              id: 'u2',
              first_name: 'Jane',
              last_name: 'Smith',
              email: 'jane.smith@admin.hpu.edu.vn'
            }
          },
          {
            id: '2',
            user_id: 'u3',
            category: 'UTILITIES',
            amount: 15000000,
            description: 'Monthly electricity bill',
            vendor: 'EVN Hai Phong',
            date: '2024-01-10',
            status: 'PENDING',
            notes: 'Higher than usual due to increased occupancy',
            created_at: '2024-01-10T09:00:00Z',
            updated_at: '2024-01-10T09:00:00Z',
            user: {
              id: 'u3',
              first_name: 'Mike',
              last_name: 'Johnson',
              email: 'mike.johnson@staff.hpu.edu.vn'
            }
          },
          {
            id: '3',
            user_id: 'u1',
            category: 'SUPPLIES',
            amount: 800000,
            description: 'Cleaning supplies for January',
            vendor: 'Clean Pro Supplies',
            receipt: 'receipt_003.pdf',
            date: '2024-01-08',
            status: 'APPROVED',
            approved_by: 'u2',
            approved_at: '2024-01-09T11:00:00Z',
            created_at: '2024-01-08T16:00:00Z',
            updated_at: '2024-01-09T11:00:00Z',
            user: {
              id: 'u1',
              first_name: 'John',
              last_name: 'Doe',
              email: 'john.doe@staff.hpu.edu.vn'
            },
            approver: {
              id: 'u2',
              first_name: 'Jane',
              last_name: 'Smith',
              email: 'jane.smith@admin.hpu.edu.vn'
            }
          },
          {
            id: '4',
            user_id: 'u4',
            category: 'EQUIPMENT',
            amount: 5000000,
            description: 'New vacuum cleaner for housekeeping',
            vendor: 'Equipment Plus',
            date: '2024-01-12',
            status: 'REJECTED',
            notes: 'Budget exceeded for this month',
            created_at: '2024-01-12T10:30:00Z',
            updated_at: '2024-01-13T14:00:00Z',
            user: {
              id: 'u4',
              first_name: 'Sarah',
              last_name: 'Wilson',
              email: 'sarah.wilson@staff.hpu.edu.vn'
            }
          }
        ];
        setExpenses(mockExpenses);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.vendor && expense.vendor.toLowerCase().includes(searchTerm.toLowerCase())) ||
      expense.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.user.last_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || expense.category === categoryFilter;
    const matchesStatus = !statusFilter || expense.status === statusFilter;
    
    const matchesDateRange = (!dateRange.start || expense.date >= dateRange.start) &&
                            (!dateRange.end || expense.date <= dateRange.end);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesDateRange;
  });

  const getStatusColor = (status: keyof typeof EXPENSE_STATUS) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'PAID': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: keyof typeof EXPENSE_CATEGORIES) => {
    switch (category) {
      case 'MAINTENANCE': return 'bg-orange-100 text-orange-800';
      case 'UTILITIES': return 'bg-blue-100 text-blue-800';
      case 'SUPPLIES': return 'bg-green-100 text-green-800';
      case 'EQUIPMENT': return 'bg-purple-100 text-purple-800';
      case 'SERVICES': return 'bg-indigo-100 text-indigo-800';
      case 'INSURANCE': return 'bg-pink-100 text-pink-800';
      case 'MARKETING': return 'bg-yellow-100 text-yellow-800';
      case 'TRAVEL': return 'bg-teal-100 text-teal-800';
      case 'OTHER': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getTotalAmount = () => {
    return filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getApprovedAmount = () => {
    return filteredExpenses
      .filter(expense => expense.status === 'APPROVED' || expense.status === 'PAID')
      .reduce((total, expense) => total + expense.amount, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600">Track and manage facility expenses and purchases</p>
        </div>
        <Link
          to="/student-hotel/expenses/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Expense
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(getTotalAmount())}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(getApprovedAmount())}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredExpenses.filter(e => e.status === 'PENDING').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by description, vendor, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {Object.entries(EXPENSE_CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              {Object.entries(EXPENSE_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
                setStatusFilter('');
                setDateRange({ start: '', end: '' });
              }}
              className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expense
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No expenses found
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {expense.description}
                        </div>
                        {expense.receipt && (
                          <div className="text-xs text-blue-600">
                            📎 Receipt attached
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(expense.category)}`}>
                        {EXPENSE_CATEGORY_LABELS[expense.category]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.vendor || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {expense.user.first_name} {expense.user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{expense.user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(expense.status)}`}>
                        {EXPENSE_STATUS_LABELS[expense.status]}
                      </span>
                      {expense.approved_at && expense.approver && (
                        <div className="text-xs text-gray-500 mt-1">
                          by {expense.approver.first_name} {expense.approver.last_name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(expense.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/student-hotel/expenses/${expense.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        <Link
                          to={`/student-hotel/expenses/${expense.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
