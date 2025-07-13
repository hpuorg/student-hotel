import { useState, useEffect } from 'react';
import { Link } from '@modern-js/runtime/router';
import { API_CONFIG } from '../../../constants';

interface ReportData {
  financial: {
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
    pendingPayments: number;
    overduePayments: number;
  };
  occupancy: {
    totalRooms: number;
    occupiedRooms: number;
    availableRooms: number;
    occupancyRate: number;
    averageStayDuration: number;
  };
  maintenance: {
    totalRequests: number;
    pendingRequests: number;
    completedRequests: number;
    averageResolutionTime: number;
    totalMaintenanceCost: number;
  };
  students: {
    totalStudents: number;
    activeStudents: number;
    newRegistrations: number;
    graduatedStudents: number;
  };
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/reports/dashboard?period=${selectedPeriod}`);
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      } else {
        // Mock data for development
        const mockData: ReportData = {
          financial: {
            totalRevenue: 125000000,
            totalExpenses: 45000000,
            netIncome: 80000000,
            pendingPayments: 15000000,
            overduePayments: 3000000,
          },
          occupancy: {
            totalRooms: 50,
            occupiedRooms: 42,
            availableRooms: 8,
            occupancyRate: 84,
            averageStayDuration: 180,
          },
          maintenance: {
            totalRequests: 25,
            pendingRequests: 5,
            completedRequests: 20,
            averageResolutionTime: 2.5,
            totalMaintenanceCost: 8500000,
          },
          students: {
            totalStudents: 45,
            activeStudents: 42,
            newRegistrations: 8,
            graduatedStudents: 3,
          },
        };
        setReportData(mockData);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Failed to load report data</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive overview of facility performance and metrics</p>
        </div>
        <div className="flex space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Quick Report Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/student-hotel/reports/financial"
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Financial Reports</h3>
              <p className="text-sm text-gray-600">Revenue, expenses, and payment analytics</p>
            </div>
          </div>
        </Link>

        <Link
          to="/student-hotel/reports/occupancy"
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Occupancy Reports</h3>
              <p className="text-sm text-gray-600">Room utilization and booking trends</p>
            </div>
          </div>
        </Link>

        <Link
          to="/student-hotel/reports/maintenance"
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Maintenance Reports</h3>
              <p className="text-sm text-gray-600">Maintenance costs and completion rates</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Financial Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Financial Overview</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(reportData.financial.totalRevenue)}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(reportData.financial.totalExpenses)}
              </div>
              <div className="text-sm text-gray-600">Total Expenses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(reportData.financial.netIncome)}
              </div>
              <div className="text-sm text-gray-600">Net Income</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {formatCurrency(reportData.financial.pendingPayments)}
              </div>
              <div className="text-sm text-gray-600">Pending Payments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(reportData.financial.overduePayments)}
              </div>
              <div className="text-sm text-gray-600">Overdue Payments</div>
            </div>
          </div>
        </div>
      </div>

      {/* Occupancy Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Occupancy Overview</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {reportData.occupancy.totalRooms}
              </div>
              <div className="text-sm text-gray-600">Total Rooms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {reportData.occupancy.occupiedRooms}
              </div>
              <div className="text-sm text-gray-600">Occupied Rooms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {reportData.occupancy.availableRooms}
              </div>
              <div className="text-sm text-gray-600">Available Rooms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatPercentage(reportData.occupancy.occupancyRate)}
              </div>
              <div className="text-sm text-gray-600">Occupancy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {reportData.occupancy.averageStayDuration} days
              </div>
              <div className="text-sm text-gray-600">Avg Stay Duration</div>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance & Students Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Maintenance Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Maintenance Overview</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Requests</span>
                <span className="font-semibold">{reportData.maintenance.totalRequests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="font-semibold text-yellow-600">{reportData.maintenance.pendingRequests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-semibold text-green-600">{reportData.maintenance.completedRequests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Resolution Time</span>
                <span className="font-semibold">{reportData.maintenance.averageResolutionTime} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Cost</span>
                <span className="font-semibold text-red-600">{formatCurrency(reportData.maintenance.totalMaintenanceCost)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Students Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Students Overview</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Students</span>
                <span className="font-semibold">{reportData.students.totalStudents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Students</span>
                <span className="font-semibold text-green-600">{reportData.students.activeStudents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">New Registrations</span>
                <span className="font-semibold text-blue-600">{reportData.students.newRegistrations}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Graduated</span>
                <span className="font-semibold text-gray-600">{reportData.students.graduatedStudents}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Export Reports</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export to Excel
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export to PDF
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Email Report
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-2-2v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6" />
              </svg>
              Print Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}