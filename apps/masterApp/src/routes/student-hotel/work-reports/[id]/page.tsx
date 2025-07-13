import { useState, useEffect } from 'react';
import { useParams, Link } from '@modern-js/runtime/router';
import { 
  WORK_REPORT_STATUS,
  WORK_REPORT_STATUS_LABELS,
  API_CONFIG 
} from '../../../../constants';

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
  notes?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  user: User;
}

export default function WorkReportViewPage() {
  const { id } = useParams();
  const [report, setReport] = useState<WorkReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchWorkReport(id);
    }
  }, [id]);

  const fetchWorkReport = async (reportId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/work-reports/${reportId}`);
      if (response.ok) {
        const data = await response.json();
        setReport(data);
      } else if (response.status === 404) {
        setError('Work report not found');
      } else {
        // Mock data for development
        const mockReport: WorkReport = {
          id: reportId,
          user_id: 'u1',
          date: '2024-02-15',
          hours_worked: 8.5,
          description: `Daily Maintenance and Cleaning Tasks - February 15, 2024

Morning Tasks (8:00 AM - 12:00 PM):
• Conducted routine inspection of all HVAC systems in Building A
• Replaced air filters in rooms 101, 102, and 105
• Cleaned and sanitized common areas including lobby, study rooms, and laundry facilities
• Restocked cleaning supplies and toiletries in all common bathrooms

Afternoon Tasks (1:00 PM - 5:00 PM):
• Responded to maintenance request in Room 201 - fixed leaky faucet
• Performed weekly safety check of fire extinguishers and emergency exits
• Cleaned exterior walkways and entrance areas
• Updated maintenance log and inventory records

Evening Tasks (5:00 PM - 6:30 PM):
• Final security check of all buildings
• Locked common areas and ensured all equipment was properly stored
• Prepared maintenance schedule for next day

Issues Encountered:
• Room 201 faucet required replacement of O-ring seal
• Low inventory of bathroom tissue - ordered additional supplies
• Minor electrical issue in study room - scheduled electrician visit

Recommendations:
• Consider upgrading HVAC filters to higher efficiency models
• Install motion sensors in common area lighting to reduce energy costs`,
          status: 'APPROVED',
          notes: 'Excellent work as always. The detailed reporting and proactive maintenance approach is appreciated.',
          approved_by: 'Facility Manager',
          approved_at: '2024-02-16T08:00:00Z',
          created_at: '2024-02-15T18:00:00Z',
          updated_at: '2024-02-16T08:00:00Z',
          user: {
            id: 'u1',
            first_name: 'Maintenance',
            last_name: 'Staff',
            email: 'maintenance@studenthotel.vn',
            role: 'STAFF'
          }
        };
        setReport(mockReport);
      }
    } catch (error) {
      setError('Failed to load work report details');
      console.error('Error fetching work report:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: keyof typeof WORK_REPORT_STATUS) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const isOvertime = () => {
    return report ? report.hours_worked > 8 : false;
  };

  const getOvertimeHours = () => {
    return report ? Math.max(0, report.hours_worked - 8) : 0;
  };

  const getProcessingTime = () => {
    if (!report?.approved_at) return null;
    const created = new Date(report.created_at);
    const approved = new Date(report.approved_at);
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

  if (error || !report) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">{error || 'Work report not found'}</div>
        <Link
          to="/student-hotel/work-reports"
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Work Reports
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
              <span className="text-2xl">📋</span>
              <h1 className="text-2xl font-bold text-gray-900">Work Report #{report.id}</h1>
            </div>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(report.status)}`}>
              {WORK_REPORT_STATUS_LABELS[report.status]}
            </span>
            {isOvertime() && (
              <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-orange-100 text-orange-800">
                Overtime: {getOvertimeHours()}h
              </span>
            )}
          </div>
          <p className="text-gray-600 mt-1">
            {formatDate(report.date)} • {report.hours_worked} hours • Submitted by {report.user.first_name} {report.user.last_name}
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/student-hotel/work-reports/${report.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Report
          </Link>
          <Link
            to="/student-hotel/work-reports"
            className="text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded-md transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Reports
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Report Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Staff Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Staff Member</h2>
            </div>
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {report.user.first_name} {report.user.last_name}
                  </h3>
                  <div className="mt-2 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {report.user.email}
                    </div>
                    <div>Role: {report.user.role}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Work Description */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Work Description</h2>
            </div>
            <div className="p-6">
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                  {report.description}
                </pre>
              </div>
            </div>
          </div>

          {/* Supervisor Notes */}
          {report.notes && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Supervisor Notes</h2>
              </div>
              <div className="p-6">
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{report.notes}</p>
                  {report.approved_by && report.approved_at && (
                    <div className="mt-3 text-sm text-gray-600">
                      Reviewed by {report.approved_by} on {formatDateTime(report.approved_at)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Report Timeline</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <div>
                    <div className="text-sm font-medium">Report Submitted</div>
                    <div className="text-xs text-gray-500">{formatDateTime(report.created_at)}</div>
                  </div>
                </div>
                
                {report.approved_at && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <div>
                      <div className="text-sm font-medium">Report Approved</div>
                      <div className="text-xs text-gray-500">{formatDateTime(report.approved_at)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-6">
          {/* Work Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Work Summary</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {report.hours_worked}h
                </div>
                <div className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(report.status)}`}>
                  {WORK_REPORT_STATUS_LABELS[report.status]}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Work Date</span>
                  <span className="font-medium">{formatDate(report.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Regular Hours</span>
                  <span className="font-medium">{Math.min(8, report.hours_worked)}h</span>
                </div>
                {isOvertime() && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overtime Hours</span>
                    <span className="font-medium text-orange-600">{getOvertimeHours()}h</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Submitted</span>
                  <span className="font-medium">{formatDate(report.created_at)}</span>
                </div>
                {getProcessingTime() !== null && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Time</span>
                    <span className="font-medium">{getProcessingTime()}h</span>
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
                to={`/student-hotel/work-reports/${report.id}/edit`}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Report
              </Link>
              
              {report.status === 'PENDING' && (
                <>
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Approve Report
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject Report
                  </button>
                </>
              )}
              
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Report
              </button>
              
              <Link
                to={`/student-hotel/work-reports/create?user_id=${report.user_id}&date=${new Date().toISOString().split('T')[0]}`}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Report
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
