import { useState, useEffect } from 'react';
import { useNavigate } from '@modern-js/runtime/router';
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

interface WorkReportFormData {
  user_id: string;
  date: string;
  hours_worked: number;
  description: string;
  status: keyof typeof WORK_REPORT_STATUS;
  notes: string;
}

export default function CreateWorkReportPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<WorkReportFormData>({
    user_id: '',
    date: new Date().toISOString().split('T')[0],
    hours_worked: 8,
    description: '',
    status: 'PENDING',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.user_id) {
      newErrors.user_id = 'Please select a staff member';
    }

    if (!formData.date) {
      newErrors.date = 'Work date is required';
    } else {
      const workDate = new Date(formData.date);
      const today = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(today.getMonth() - 1);
      
      if (workDate > today) {
        newErrors.date = 'Work date cannot be in the future';
      } else if (workDate < oneMonthAgo) {
        newErrors.date = 'Work date cannot be more than 1 month ago';
      }
    }

    if (formData.hours_worked <= 0) {
      newErrors.hours_worked = 'Hours worked must be greater than 0';
    } else if (formData.hours_worked > 24) {
      newErrors.hours_worked = 'Hours worked cannot exceed 24 hours in a day';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Work description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
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
      const response = await fetch(`${API_CONFIG.BASE_URL}/work-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          notes: formData.notes || null,
        }),
      });

      if (response.ok) {
        navigate('/student-hotel/work-reports');
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Failed to create work report' });
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
      [name]: name === 'hours_worked' ? parseFloat(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getWorkTypeTemplates = () => {
    return [
      {
        title: 'Routine Maintenance',
        description: 'Performed routine maintenance checks on HVAC systems, replaced air filters, and cleaned ventilation ducts in Building A.',
        hours: 6
      },
      {
        title: 'Deep Cleaning',
        description: 'Deep cleaning of common areas including lobby, study rooms, and laundry facilities. Restocked supplies and sanitized all surfaces.',
        hours: 8
      },
      {
        title: 'Security Patrol',
        description: 'Conducted security patrol rounds, checked all entry points and emergency exits, updated access logs and incident reports.',
        hours: 4
      },
      {
        title: 'Emergency Response',
        description: 'Responded to emergency maintenance issue - burst pipe in basement. Coordinated with external contractor and supervised repairs.',
        hours: 10
      },
      {
        title: 'Administrative Tasks',
        description: 'Processed student check-ins, updated room assignments, handled maintenance requests, and coordinated with housekeeping staff.',
        hours: 7
      }
    ];
  };

  const applyTemplate = (template: any) => {
    setFormData(prev => ({
      ...prev,
      description: template.description,
      hours_worked: template.hours
    }));
  };

  const isOvertime = () => {
    return formData.hours_worked > 8;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Work Report</h1>
          <p className="text-gray-600">Record daily work activities and hours</p>
        </div>
        <button
          onClick={() => navigate('/student-hotel/work-reports')}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Work Reports
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="text-red-800">{errors.submit}</div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Staff Member */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Staff Member *
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

                {/* Work Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Date *
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

                {/* Hours Worked */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hours Worked *
                  </label>
                  <input
                    type="number"
                    name="hours_worked"
                    value={formData.hours_worked}
                    onChange={handleInputChange}
                    min="0.5"
                    max="24"
                    step="0.5"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.hours_worked ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.hours_worked && (
                    <p className="mt-1 text-sm text-red-600">{errors.hours_worked}</p>
                  )}
                  {isOvertime() && (
                    <p className="mt-1 text-sm text-orange-600">
                      ⚠️ Overtime hours detected ({formData.hours_worked - 8} hours over standard)
                    </p>
                  )}
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
                    {Object.entries(WORK_REPORT_STATUS_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Work Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Describe the work performed, tasks completed, issues encountered, and any notable achievements..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Be specific about tasks completed, time spent on each activity, and any challenges faced.
                </p>
              </div>

              {/* Additional Notes */}
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
                  placeholder="Any additional comments, recommendations, or follow-up actions needed..."
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/student-hotel/work-reports')}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Report'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Templates Sidebar */}
        <div className="space-y-6">
          {/* Quick Templates */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Templates</h3>
              <p className="text-sm text-gray-600">Click to apply common work descriptions</p>
            </div>
            <div className="p-4 space-y-3">
              {getWorkTypeTemplates().map((template, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => applyTemplate(template)}
                  className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-sm text-gray-900">{template.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{template.hours} hours</div>
                  <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {template.description.substring(0, 80)}...
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-blue-800 font-medium mb-2">Reporting Guidelines</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <div>• <strong>Accuracy:</strong> Report actual hours worked</div>
              <div>• <strong>Detail:</strong> Be specific about tasks completed</div>
              <div>• <strong>Timeliness:</strong> Submit reports within 24 hours</div>
              <div>• <strong>Overtime:</strong> Justify any hours over 8 per day</div>
              <div>• <strong>Issues:</strong> Report any problems or delays</div>
            </div>
          </div>

          {/* Time Tracking Tips */}
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <h3 className="text-green-800 font-medium mb-2">Time Tracking Tips</h3>
            <div className="text-sm text-green-700 space-y-1">
              <div>• Break down work into specific tasks</div>
              <div>• Include travel time if applicable</div>
              <div>• Note any breaks or interruptions</div>
              <div>• Record materials or tools used</div>
              <div>• Mention any safety incidents</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
