import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@modern-js/runtime/router';
import { 
  ASSET_CATEGORIES, 
  ASSET_STATUS, 
  ASSET_CONDITIONS,
  ASSET_CATEGORY_LABELS,
  ASSET_STATUS_LABELS,
  ASSET_CONDITION_LABELS,
  API_CONFIG 
} from '../../../../../constants';

interface AssetFormData {
  room_id: string;
  name: string;
  category: keyof typeof ASSET_CATEGORIES;
  status: keyof typeof ASSET_STATUS;
  condition: keyof typeof ASSET_CONDITIONS;
  serial_number: string;
  purchase_date: string;
  purchase_cost: number;
  warranty_expiry: string;
  last_maintenance: string;
  notes: string;
}

interface Room {
  id: string;
  number: string;
  building: { name: string };
}

export default function EditAssetPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState<AssetFormData>({
    room_id: '',
    name: '',
    category: 'FURNITURE',
    status: 'ACTIVE',
    condition: 'GOOD',
    serial_number: '',
    purchase_date: '',
    purchase_cost: 0,
    warranty_expiry: '',
    last_maintenance: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      fetchAsset(id);
    }
    fetchRooms();
  }, [id]);

  const fetchAsset = async (assetId: string) => {
    try {
      setInitialLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/assets/${assetId}`);
      if (response.ok) {
        const asset = await response.json();
        setFormData({
          room_id: asset.room_id || '',
          name: asset.name || '',
          category: asset.category || 'FURNITURE',
          status: asset.status || 'ACTIVE',
          condition: asset.condition || 'GOOD',
          serial_number: asset.serial_number || '',
          purchase_date: asset.purchase_date ? asset.purchase_date.split('T')[0] : '',
          purchase_cost: asset.purchase_cost || 0,
          warranty_expiry: asset.warranty_expiry ? asset.warranty_expiry.split('T')[0] : '',
          last_maintenance: asset.last_maintenance ? asset.last_maintenance.split('T')[0] : '',
          notes: asset.notes || '',
        });
      } else if (response.status === 404) {
        navigate('/student-hotel/assets');
      } else {
        // Mock data for development
        setFormData({
          room_id: 'r1',
          name: 'Samsung 55" Smart TV',
          category: 'ELECTRONICS',
          status: 'ACTIVE',
          condition: 'GOOD',
          serial_number: 'SAM-TV-2024-001',
          purchase_date: '2024-01-15',
          purchase_cost: 15000000,
          warranty_expiry: '2026-01-15',
          last_maintenance: '2024-01-20',
          notes: 'Installed in common area. Regular cleaning and software updates performed.',
        });
      }
    } catch (error) {
      console.error('Error fetching asset:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/rooms`);
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Asset name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (formData.purchase_cost < 0) {
      newErrors.purchase_cost = 'Purchase cost cannot be negative';
    }

    if (formData.purchase_date && formData.warranty_expiry) {
      const purchaseDate = new Date(formData.purchase_date);
      const warrantyDate = new Date(formData.warranty_expiry);
      
      if (warrantyDate <= purchaseDate) {
        newErrors.warranty_expiry = 'Warranty expiry must be after purchase date';
      }
    }

    if (formData.last_maintenance) {
      const maintenanceDate = new Date(formData.last_maintenance);
      const today = new Date();
      
      if (maintenanceDate > today) {
        newErrors.last_maintenance = 'Last maintenance date cannot be in the future';
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
      const response = await fetch(`${API_CONFIG.BASE_URL}/assets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          room_id: formData.room_id || null,
          serial_number: formData.serial_number || null,
          purchase_date: formData.purchase_date || null,
          purchase_cost: formData.purchase_cost || null,
          warranty_expiry: formData.warranty_expiry || null,
          last_maintenance: formData.last_maintenance || null,
          notes: formData.notes || null,
        }),
      });

      if (response.ok) {
        navigate(`/student-hotel/assets/${id}`);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Failed to update asset' });
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
      [name]: name === 'purchase_cost' ? parseFloat(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const generateSerialNumber = () => {
    const category = formData.category.substring(0, 3).toUpperCase();
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const serialNumber = `${category}-${year}-${random}`;
    setFormData(prev => ({ ...prev, serial_number: serialNumber }));
  };

  const getCategoryIcon = (category: keyof typeof ASSET_CATEGORIES) => {
    switch (category) {
      case 'FURNITURE': return '🪑';
      case 'ELECTRONICS': return '📺';
      case 'APPLIANCES': return '🔌';
      case 'HVAC': return '❄️';
      case 'SECURITY': return '🔒';
      case 'CLEANING': return '🧹';
      case 'OTHER': return '📦';
      default: return '📦';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Asset</h1>
          <p className="text-gray-600">Update asset details and information</p>
        </div>
        <button
          onClick={() => navigate(`/student-hotel/assets/${id}`)}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Asset
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

          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asset Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Samsung 55\" Smart TV"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

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
                  {Object.entries(ASSET_CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {getCategoryIcon(key as keyof typeof ASSET_CATEGORIES)} {label}
                    </option>
                  ))}
                </select>
              </div>

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
                  {Object.entries(ASSET_STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition *
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(ASSET_CONDITION_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location (Optional)
                </label>
                <select
                  name="room_id"
                  value={formData.room_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No specific room</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      Room {room.number} - {room.building.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Number
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="serial_number"
                    value={formData.serial_number}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="SAM-TV-2024-001"
                  />
                  <button
                    type="button"
                    onClick={generateSerialNumber}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Date
                </label>
                <input
                  type="date"
                  name="purchase_date"
                  value={formData.purchase_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Cost (VND)
                </label>
                <input
                  type="number"
                  name="purchase_cost"
                  value={formData.purchase_cost}
                  onChange={handleInputChange}
                  min="0"
                  step="10000"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.purchase_cost ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.purchase_cost && (
                  <p className="mt-1 text-sm text-red-600">{errors.purchase_cost}</p>
                )}
                {formData.purchase_cost > 0 && (
                  <p className="mt-1 text-sm text-gray-500">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(formData.purchase_cost)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warranty Expiry
                </label>
                <input
                  type="date"
                  name="warranty_expiry"
                  value={formData.warranty_expiry}
                  onChange={handleInputChange}
                  min={formData.purchase_date}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.warranty_expiry ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.warranty_expiry && (
                  <p className="mt-1 text-sm text-red-600">{errors.warranty_expiry}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Maintenance
                </label>
                <input
                  type="date"
                  name="last_maintenance"
                  value={formData.last_maintenance}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.last_maintenance ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.last_maintenance && (
                  <p className="mt-1 text-sm text-red-600">{errors.last_maintenance}</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes about the asset..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/student-hotel/assets/${id}`)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
