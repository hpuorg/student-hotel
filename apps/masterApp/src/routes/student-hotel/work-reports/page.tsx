import { useState, useEffect } from 'react';
import { Link } from '@modern-js/runtime/router';
import { 
  WORK_REPORT_STATUS,
  WORK_REPORT_STATUS_LABELS,
  API_CONFIG 
} from '../../../constants';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface WorkReport {
  id: string;
  user_id: string;
  date: string;
  hours_worked: number;
  description: string;
  status: keyof typeof WORK_REPORT_STATUS;
  approved_by?: string;
  approved_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  user: User;
  approver?: User;
}

export default function WorkReportsPage() {
  const [workReports, setWorkReports] = useState<WorkReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [staffFilter, setStaffFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchWorkReports();
    fetchUsers();
  }, []);

  const fetchWorkReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/work-reports`);
      if (response.ok) {
        const data = await response.json();
        setWorkReports(data);
      } else {
        // Mock data for development
        const mockReports: WorkReport[] = [
          {
            id: '1',
            user_id: 'u1',
            date: '2024-01-15',
            hours_worked: 8,
            description: 'Routine maintenance checks on all HVAC systems in Building A. Replaced air filters in rooms 101-105. Cleaned ventilation ducts.',
            status: 'APPROVED',
            approved_by: 'u2',
            approved_at: '2024-01-16T09:00:00Z',
            created_at: '2024-01-15T17:00:00Z',
            updated_at: '2024-01-16T09:00:00Z',
            user: {
              id: 'u1',
              first_name: 'John',
              last_name: 'Doe',
              email: 'john.doe@staff.hpu.edu.vn',
              role: 'STAFF'
            },
            approver: {
              id: 'u2',
              first_name: 'Jane',
              last_name: 'Smith',
              email: 'jane.smith@admin.hpu.edu.vn',
              role: 'ADMIN'
            }
          },
          {
            id: '2',
            user_id: 'u3',
            date: '2024-01-15',
            hours_worked: 6,
            description: 'Deep cleaning of common areas including lobby, study rooms, and laundry facilities. Restocked supplies.',
            status: 'PENDING',
            created_at: '2024-01-15T18:30:00Z',
            updated_at: '2024-01-15T18:30:00Z',
            user: {
              id: 'u3',
              first_name: 'Mike',
              last_name: 'Johnson',
              email: 'mike.johnson@staff.hpu.edu.vn',
              role: 'STAFF'
            }
          },
          {
            id: '3',
            user_id: 'u4',
            date: '2024-01-14',
            hours_worked: 4,
            description: 'Security patrol rounds. Checked all entry points and emergency exits. Updated access logs.',
            status: 'APPROVED',
            approved_by: 'u2',
            approved_at: '2024-01-15T08:00:00Z',
            created_at: '2024-01-14T22:00:00Z',
            updated_at: '2024-01-15T08:00:00Z',
            user: {
              id: 'u4',
              first_name: 'Sarah',
              last_name: 'Wilson',
              email: 'sarah.wilson@staff.hpu.edu.vn',
              role: 'STAFF'
            },
            approver: {
              id: 'u2',
              first_name: 'Jane',
              last_name: 'Smith',
              email: 'jane.smith@admin.hpu.edu.vn',
              role: 'ADMIN'
            }
          },
          {
            id: '4',
            user_id: 'u1',
            date: '2024-01-13',
            hours_worked: 10,
            description: 'Emergency plumbing repair in Building B. Fixed burst pipe in basement. Coordinated with external contractor.',
            status: 'APPROVED',
            approved_by: 'u2',
            approved_at: '2024-01-14T10:00:00Z',
            notes: 'Overtime approved due to emergency nature',
            created_at: '2024-01-13T20:00:00Z',
            updated_at: '2024-01-14T10:00:00Z',
            user: {
              id: 'u1',
              first_name: 'John',
              last_name: 'Doe',
              email: 'john.doe@staff.hpu.edu.vn',
              role: 'STAFF'
            },
            approver: {
              id: 'u2',
              first_name: 'Jane',
              last_name: 'Smith',
              email: 'jane.smith@admin.hpu.edu.vn',
              role: 'ADMIN'
            }
          }
        ];
        setWorkReports(mockReports);
      }
    } catch (error) {
      console.error('Error fetching work reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/users?role=STAFF`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const filteredReports = workReports.filter(report => {
    const matchesSearch = 
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.user.last_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || report.status === statusFilter;
    const matchesStaff = !staffFilter || report.user_id === staffFilter;
    
    const matchesDateRange = (!dateRange.start || report.date >= dateRange.start) &&
                            (!dateRange.end || report.date <= dateRange.end);
    
    return matchesSearch && matchesStatus && matchesStaff && matchesDateRange;
  });

  const getStatusColor = (status: keyof typeof WORK_REPORT_STATUS) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTotalHours = () => {
    return filteredReports.reduce((total, report) => total + report.hours_worked, 0);
  };

  const getApprovedHours = () => {
    return filteredReports
      .filter(report => report.status === 'APPROVED')
      .reduce((total, report) => total + report.hours_worked, 0);
  };

  const getAverageHours = () => {
    if (filteredReports.length === 0) return 0;
    return getTotalHours() / filteredReports.length;
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
          <h1 className="text-2xl font-bold text-gray-900">Work Reports</h1>
          <p className="text-gray-600">Track staff work hours and daily activities</p>
        </div>
        <Link
          to="/student-hotel/work-reports/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Report
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalHours()}</p>
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
              <p className="text-sm font-medium text-gray-600">Approved Hours</p>
              <p className="text-2xl font-bold text-gray-900">{getApprovedHours()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Hours</p>
              <p className="text-2xl font-bold text-gray-900">{getAverageHours().toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{filteredReports.length}</p>
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
              placeholder="Search by description or staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Staff</label>
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Staff</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
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
              {Object.entries(WORK_REPORT_STATUS_LABELS).map(([key, label]) => (
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
                setStaffFilter('');
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

      {/* Work Reports List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No work reports found
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {report.user.first_name} {report.user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{report.user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(report.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {report.hours_worked} hours
                      </div>
                      {report.hours_worked > 8 && (
                        <div className="text-xs text-orange-600">Overtime</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {report.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                        {WORK_REPORT_STATUS_LABELS[report.status]}
                      </span>
                      {report.approved_at && report.approver && (
                        <div className="text-xs text-gray-500 mt-1">
                          by {report.approver.first_name} {report.approver.last_name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(report.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/student-hotel/work-reports/${report.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        <Link
                          to={`/student-hotel/work-reports/${report.id}/edit`}
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
