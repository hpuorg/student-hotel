import { useState } from 'react';
import { useNavigate } from '@modern-js/runtime/router';
import { API_CONFIG, ROUTES } from '../../../../constants';

interface CreateBuildingForm {
  org_id: string;
  name: string;
  address: string;
  floors: number;
  description: string;
}

export default function CreateBuildingPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<CreateBuildingForm>({
    org_id: API_CONFIG.DEFAULT_ORG_ID,
    name: '',
    address: '',
    floors: 1,
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // API Base URL - replace with your n8n webhook URL
  const API_BASE = 'https://your-n8n-instance.com/webhook';

  const handleInputChange = (field: keyof CreateBuildingForm, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Building name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (formData.floors < 1) {
      newErrors.floors = 'Number of floors must be at least 1';
    }

    if (!formData.org_id.trim()) {
      newErrors.org_id = 'Organization ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      
      const response = await fetch(`${API_BASE}/buildings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Success - redirect to buildings list
        navigate('/student-hotel/buildings');
      } else {
        // Handle API errors
        console.error('API Error:', data.message);
        alert('Error creating building: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating building:', error);
      alert('Error creating building. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/student-hotel/buildings');
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Building</h1>
        <p className="text-gray-600 mt-2">Add a new building to the student hotel system</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Building Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Building Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Building A, North Hall, etc."
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Full address of the building"
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Floors <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.floors}
                    onChange={(e) => handleInputChange('floors', parseInt(e.target.value))}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.floors ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.floors && <p className="text-red-500 text-sm mt-1">{errors.floors}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.org_id}
                    onChange={(e) => handleInputChange('org_id', e.target.value)}
                    placeholder="e.g., hpu.edu.vn"
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.org_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.org_id && <p className="text-red-500 text-sm mt-1">{errors.org_id}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Optional description of the building, amenities, special features, etc."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Describe the building's features, amenities, or any special characteristics
                </p>
              </div>
            </div>
          </div>

          {/* Building Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Building Creation Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Choose a clear, descriptive name for easy identification</li>
              <li>• Provide the complete address including street, city, and postal code</li>
              <li>• Ensure the number of floors is accurate for room assignment</li>
              <li>• Use the correct organization ID for proper categorization</li>
              <li>• Include relevant amenities and features in the description</li>
            </ul>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Name:</strong> {formData.name || 'Not specified'}</p>
              <p><strong>Address:</strong> {formData.address || 'Not specified'}</p>
              <p><strong>Floors:</strong> {formData.floors}</p>
              <p><strong>Organization:</strong> {formData.org_id}</p>
              {formData.description && (
                <p><strong>Description:</strong> {formData.description}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {submitting && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {submitting ? 'Creating...' : 'Create Building'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
