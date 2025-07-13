import { useState } from 'react';
import { useNavigate } from '@modern-js/runtime/router';
import { API_CONFIG } from '../../../../constants';

interface AmenityFormData {
  name: string;
  description: string;
  icon: string;
}

const COMMON_ICONS = [
  { emoji: '📶', name: 'Wi-Fi' },
  { emoji: '❄️', name: 'Air Conditioning' },
  { emoji: '🚿', name: 'Bathroom' },
  { emoji: '📚', name: 'Study Desk' },
  { emoji: '👔', name: 'Wardrobe' },
  { emoji: '🧊', name: 'Refrigerator' },
  { emoji: '📺', name: 'TV' },
  { emoji: '🛏️', name: 'Bed' },
  { emoji: '🪑', name: 'Chair' },
  { emoji: '💡', name: 'Lighting' },
  { emoji: '🔌', name: 'Power Outlets' },
  { emoji: '🚪', name: 'Private Entrance' },
  { emoji: '🪟', name: 'Window' },
  { emoji: '🧺', name: 'Laundry' },
  { emoji: '🍽️', name: 'Kitchen Access' },
  { emoji: '🏠', name: 'General' }
];

export default function CreateAmenityPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AmenityFormData>({
    name: '',
    description: '',
    icon: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Amenity name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Amenity name must be at least 2 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
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
      const response = await fetch(`${API_CONFIG.BASE_URL}/amenities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          description: formData.description || null,
          icon: formData.icon || null,
        }),
      });

      if (response.ok) {
        navigate('/student-hotel/amenities');
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Failed to create amenity' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleIconSelect = (emoji: string) => {
    setFormData(prev => ({ ...prev, icon: emoji }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Amenity</h1>
          <p className="text-gray-600">Create a new amenity for rooms</p>
        </div>
        <button
          onClick={() => navigate('/student-hotel/amenities')}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Amenities
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

          {/* Amenity Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenity Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., Wi-Fi, Air Conditioning, Private Bathroom"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe the amenity and its benefits..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <div className="space-y-4">
              {/* Custom Icon Input */}
              <div>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter an emoji or leave blank"
                />
                <p className="mt-1 text-sm text-gray-500">
                  You can enter any emoji or leave blank for a default icon
                </p>
              </div>

              {/* Common Icons Grid */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Or choose from common icons:</p>
                <div className="grid grid-cols-8 gap-2">
                  {COMMON_ICONS.map((iconOption) => (
                    <button
                      key={iconOption.emoji}
                      type="button"
                      onClick={() => handleIconSelect(iconOption.emoji)}
                      className={`p-3 text-2xl border rounded-md hover:bg-gray-50 transition-colors ${
                        formData.icon === iconOption.emoji 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300'
                      }`}
                      title={iconOption.name}
                    >
                      {iconOption.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              {formData.icon && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                  <div className="text-3xl">{formData.icon}</div>
                  <div>
                    <div className="font-medium text-gray-900">{formData.name || 'Amenity Name'}</div>
                    <div className="text-sm text-gray-500">Preview</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/student-hotel/amenities')}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Amenity'}
            </button>
          </div>
        </form>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-blue-800 font-medium mb-2">Tips for Creating Amenities</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use clear, descriptive names that guests will easily understand</li>
          <li>• Choose relevant icons to make amenities visually recognizable</li>
          <li>• Add descriptions to explain the value or details of the amenity</li>
          <li>• Consider grouping similar amenities (e.g., "Private Bathroom" vs "Shared Bathroom")</li>
        </ul>
      </div>
    </div>
  );
}
