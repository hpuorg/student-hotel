import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@modern-js/runtime/router';
import { 
  WORK_REPORT_STATUS,
  WORK_REPORT_STATUS_LABELS,
  API_CONFIG 
} from '../../../../../constants';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface WorkReportFormData {
  date: string;
  hours_worked: number;
  description: string;
  status: keyof typeof WORK_REPORT_STATUS;
  notes: string;
}

export default function EditWorkReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<WorkReportFormData>({
    date: '',
    hours_worked: 0,
    description: '',
    status: 'DRAFT',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      fetchWorkReport(id);
    }
  }, [id]);

  const fetchWorkReport = async (reportId: string) => {
    try {
      setInitialLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/work-reports/${reportId}`);
      if (response.ok) {
        const report = await response.json();
        setFormData({
          date: report.date ? report.date.split('T')[0] : '',
          hours_worked: report.hours_worked || 0,
          description: report.description || '',
          status: report.status || 'DRAFT',
          notes: report.notes || '',
        });
        setUser(report.user);
      } else if (response.status === 404) {
        navigate('/student-hotel/work-reports');
      } else {
        // Mock data for development
        const mockReport = {
          date: '2024-01-15',
          hours_worked: 8,
          description: 'Completed routine maintenance checks on Building A HVAC systems. Replaced air filters on floors 2-4 and performed preventive maintenance on elevator systems. Responded to two maintenance requests: fixed leaky faucet in Room A201 and replaced broken light fixture in common area.',
          status: 'SUBMITTED' as keyof typeof WORK_REPORT_STATUS,
          notes: 'All tasks completed on schedule. Elevator maintenance required additional parts which have been ordered.',
          user: {
            id: 'u1',
            first_name: 'Mike',
            last_name: 'Johnson',
            email: 'mike.johnson@hpu.edu.vn',
            role: 'STAFF'
          }
        };
        setFormData({
          date: mockReport.date,
          hours_worked: mockReport.hours_worked,
          description: mockReport.description,
          status: mockReport.status,
          notes: mockReport.notes,
        });
        setUser(mockReport.user);
      }
    } catch (error) {
      console.error('Error fetching work report:', error);
      // Use mock data for development
      const mockReport = {
        date: '2024-01-15',
        hours_worked: 8,
        description: 'Completed routine maintenance checks on Building A HVAC systems. Replaced air filters on floors 2-4 and performed preventive maintenance on elevator systems. Responded to two maintenance requests: fixed leaky faucet in Room A201 and replaced broken light fixture in common area.',
        status: 'SUBMITTED' as keyof typeof WORK_REPORT_STATUS,
        notes: 'All tasks completed on schedule. Elevator maintenance required additional parts which have been ordered.',
        user: {
          id: 'u1',
          first_name: 'Mike',
          last_name: 'Johnson',
          email: 'mike.johnson@hpu.edu.vn',
          role: 'STAFF'
        }
      };
      setFormData({
        date: mockReport.date,
        hours_worked: mockReport.hours_worked,
        description: mockReport.description,
        status: mockReport.status,
        notes: mockReport.notes,
      });
      setUser(mockReport.user);
    } finally {
      setInitialLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (formData.date && new Date(formData.date) > new Date()) {
      newErrors.date = 'Date cannot be in the future';
    }

    if (formData.hours_worked <= 0) {
      newErrors.hours_worked = 'Hours worked must be greater than 0';
    }

    if (formData.hours_worked > 24) {
      newErrors.hours_worked = 'Hours worked cannot exceed 24 hours per day';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
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
      const response = await fetch(`${API_CONFIG.BASE_URL}/work-reports/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          notes: formData.notes || null,
        }),
      });

      if (response.ok) {
        navigate(`/student-hotel/work-reports/${id}`);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Failed to update work report' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof WorkReportFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(`/student-hotel/work-reports/${id}`)}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Work Report</h1>
      </div>

      {/* Staff Info */}
      {user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <h3 className="font-medium text-blue-900">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-sm text-blue-700">{user.email}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-blue-900">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Work Report Details</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{errors.submit}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.date ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
            </div>

            {/* Hours Worked */}
            <div>
              <label htmlFor="hours_worked" className="block text-sm font-medium text-gray-700 mb-1">
                Hours Worked *
              </label>
              <input
                type="number"
                id="hours_worked"
                min="0"
                max="24"
                step="0.5"
                value={formData.hours_worked}
                onChange={(e) => handleInputChange('hours_worked', parseFloat(e.target.value) || 0)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.hours_worked ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., 8"
              />
              {errors.hours_worked && <p className="mt-1 text-sm text-red-600">{errors.hours_worked}</p>}
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(WORK_REPORT_STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Work Description *
            </label>
            <textarea
              id="description"
              rows={6}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe the work performed, tasks completed, issues encountered, etc."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            <p className="mt-1 text-sm text-gray-500">
              Minimum 10 characters. Be specific about tasks completed and any issues encountered.
            </p>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              id="notes"
              rows={4}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional notes, observations, or recommendations (optional)"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/student-hotel/work-reports/${id}`)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Updating...' : 'Update Work Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
