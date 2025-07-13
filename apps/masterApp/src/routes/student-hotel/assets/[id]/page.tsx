import { useState, useEffect } from 'react';
import { useParams, Link } from '@modern-js/runtime/router';
import {
  ASSET_CATEGORIES,
  ASSET_STATUS,
  ASSET_CONDITIONS,
  ASSET_CATEGORY_LABELS,
  ASSET_STATUS_LABELS,
  ASSET_CONDITION_LABELS,
  API_CONFIG
} from '../../../../constants';

interface Room {
  id: string;
  number: string;
  building: { name: string };
}

interface Asset {
  id: string;
  room_id?: string;
  name: string;
  category: keyof typeof ASSET_CATEGORIES;
  status: keyof typeof ASSET_STATUS;
  condition: keyof typeof ASSET_CONDITIONS;
  serial_number?: string;
  purchase_date?: string;
  purchase_cost?: number;
  warranty_expiry?: string;
  last_maintenance?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  room?: Room;
}

export default function AssetViewPage() {
  const { id } = useParams();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchAsset(id);
    }
  }, [id]);

  const fetchAsset = async (assetId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/assets/${assetId}`);
      if (response.ok) {
        const data = await response.json();
        setAsset(data);
      } else if (response.status === 404) {
        setError('Asset not found');
      } else {
        // Mock data for development
        const mockAsset: Asset = {
          id: assetId,
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
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-20T14:30:00Z',
          room: {
            id: 'r1',
            number: '101',
            building: { name: 'Building A' }
          }
        };
        setAsset(mockAsset);
      }
    } catch (error) {
      setError('Failed to load asset details');
      console.error('Error fetching asset:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: keyof typeof ASSET_STATUS) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800';
      case 'RETIRED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: keyof typeof ASSET_CONDITIONS) => {
    switch (condition) {
      case 'EXCELLENT': return 'bg-green-100 text-green-800';
      case 'GOOD': return 'bg-blue-100 text-blue-800';
      case 'FAIR': return 'bg-yellow-100 text-yellow-800';
      case 'POOR': return 'bg-orange-100 text-orange-800';
      case 'DAMAGED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const isWarrantyExpired = () => {
    if (!asset?.warranty_expiry) return false;
    return new Date(asset.warranty_expiry) < new Date();
  };

  const getWarrantyDaysRemaining = () => {
    if (!asset?.warranty_expiry) return null;
    const today = new Date();
    const warranty = new Date(asset.warranty_expiry);
    const diffTime = warranty.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getAssetAge = () => {
    if (!asset?.purchase_date) return null;
    const today = new Date();
    const purchase = new Date(asset.purchase_date);
    const diffTime = today.getTime() - purchase.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''}`;
    }
    return `${months} month${months > 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">{error || 'Asset not found'}</div>
        <Link
          to="/student-hotel/assets"
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Assets
        </Link>
      </div>
    );
  }

  const warrantyDays = getWarrantyDaysRemaining();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getCategoryIcon(asset.category)}</span>
              <h1 className="text-2xl font-bold text-gray-900">{asset.name}</h1>
            </div>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(asset.status)}`}>
              {ASSET_STATUS_LABELS[asset.status]}
            </span>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getConditionColor(asset.condition)}`}>
              {ASSET_CONDITION_LABELS[asset.condition]}
            </span>
          </div>
          <p className="text-gray-600 mt-1">
            Asset #{asset.id} • {ASSET_CATEGORY_LABELS[asset.category]} • Added {formatDate(asset.created_at)}
          </p>
          {asset.warranty_expiry && (
            <div className={`mt-2 flex items-center ${isWarrantyExpired() ? 'text-red-600' : warrantyDays && warrantyDays < 30 ? 'text-orange-600' : 'text-green-600'}`}>
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {isWarrantyExpired() ? 'Warranty Expired' : `Warranty: ${warrantyDays} days remaining`}
            </div>
          )}
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/student-hotel/assets/${asset.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Asset
          </Link>
          <Link
            to="/student-hotel/assets"
            className="text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded-md transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Assets
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Asset Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Asset Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Basic Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{asset.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{ASSET_CATEGORY_LABELS[asset.category]}</span>
                    </div>
                    {asset.serial_number && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Serial Number:</span>
                        <span className="font-medium font-mono text-xs">{asset.serial_number}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(asset.status)}`}>
                        {ASSET_STATUS_LABELS[asset.status]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Condition:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(asset.condition)}`}>
                        {ASSET_CONDITION_LABELS[asset.condition]}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Location</h3>
                  <div className="space-y-3 text-sm">
                    {asset.room ? (
                      <div>
                        <div className="flex items-center text-gray-700">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Room {asset.room.number} - {asset.room.building.name}
                        </div>
                        <Link
                          to={`/student-hotel/rooms/${asset.room.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Room Details
                        </Link>
                      </div>
                    ) : (
                      <div className="text-gray-500 italic">No specific room assigned</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          {(asset.purchase_date || asset.purchase_cost) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Financial Information</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 text-sm">
                    {asset.purchase_date && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Purchase Date:</span>
                        <span className="font-medium">{formatDate(asset.purchase_date)}</span>
                      </div>
                    )}
                    {asset.purchase_cost && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Purchase Cost:</span>
                        <span className="font-medium">{formatCurrency(asset.purchase_cost)}</span>
                      </div>
                    )}
                    {getAssetAge() && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Asset Age:</span>
                        <span className="font-medium">{getAssetAge()}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 text-sm">
                    {asset.warranty_expiry && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Warranty Expiry:</span>
                        <span className={`font-medium ${isWarrantyExpired() ? 'text-red-600' : 'text-green-600'}`}>
                          {formatDate(asset.warranty_expiry)}
                        </span>
                      </div>
                    )}
                    {warrantyDays !== null && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Warranty Status:</span>
                        <span className={`font-medium ${isWarrantyExpired() ? 'text-red-600' : warrantyDays < 30 ? 'text-orange-600' : 'text-green-600'}`}>
                          {isWarrantyExpired() ? 'Expired' : `${warrantyDays} days left`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Maintenance Information */}
          {asset.last_maintenance && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Maintenance History</h2>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Maintenance:</span>
                  <span className="font-medium">{formatDate(asset.last_maintenance)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {asset.notes && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{asset.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-6">
          {/* Asset Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Asset Summary</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="text-3xl mb-2">{getCategoryIcon(asset.category)}</div>
                <div className="text-lg font-semibold text-gray-900">{asset.name}</div>
                <div className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full mt-2 ${getStatusColor(asset.status)}`}>
                  {ASSET_STATUS_LABELS[asset.status]}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium">{ASSET_CATEGORY_LABELS[asset.category]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Condition</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(asset.condition)}`}>
                    {ASSET_CONDITION_LABELS[asset.condition]}
                  </span>
                </div>
                {asset.purchase_cost && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Value</span>
                    <span className="font-medium">{formatCurrency(asset.purchase_cost)}</span>
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
                to={`/student-hotel/assets/${asset.id}/edit`}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Asset
              </Link>

              <Link
                to={`/student-hotel/maintenance/create?asset_id=${asset.id}&description=${encodeURIComponent(`Maintenance for ${asset.name}`)}`}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Schedule Maintenance
              </Link>

              <button
                className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  asset.status === 'ACTIVE'
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {asset.status === 'ACTIVE' ? 'Mark for Maintenance' : 'Mark as Active'}
              </button>

              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generate Asset Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}