import { useState, useEffect } from 'react';
import { Link } from '@modern-js/runtime/router';
import { 
  ASSET_CATEGORIES, 
  ASSET_STATUS, 
  ASSET_CONDITIONS,
  ASSET_CATEGORY_LABELS,
  ASSET_STATUS_LABELS,
  ASSET_CONDITION_LABELS,
  API_CONFIG 
} from '../../../constants';

interface Room {
  id: string;
  number: string;
  building: {
    name: string;
  };
}

interface Asset {
  id: string;
  room_id?: string;
  name: string;
  category: keyof typeof ASSET_CATEGORIES;
  brand?: string;
  model?: string;
  serial_number?: string;
  purchase_date?: string;
  purchase_price?: number;
  warranty_expiry?: string;
  status: keyof typeof ASSET_STATUS;
  condition: keyof typeof ASSET_CONDITIONS;
  notes?: string;
  created_at: string;
  updated_at: string;
  room?: Room;
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [conditionFilter, setConditionFilter] = useState<string>('');

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/assets`);
      if (response.ok) {
        const data = await response.json();
        setAssets(data);
      } else {
        // Mock data for development
        const mockAssets: Asset[] = [
          {
            id: '1',
            room_id: 'r1',
            name: 'Air Conditioner Unit',
            category: 'APPLIANCES',
            brand: 'Daikin',
            model: 'FTKC35UAVMA',
            serial_number: 'AC2024001',
            purchase_date: '2024-01-15',
            purchase_price: 15000000,
            warranty_expiry: '2027-01-15',
            status: 'ACTIVE',
            condition: 'EXCELLENT',
            created_at: '2024-01-15T08:00:00Z',
            updated_at: '2024-01-15T08:00:00Z',
            room: {
              id: 'r1',
              number: '101',
              building: { name: 'Building A' }
            }
          },
          {
            id: '2',
            room_id: 'r2',
            name: 'Study Desk',
            category: 'FURNITURE',
            brand: 'IKEA',
            model: 'LINNMON',
            purchase_date: '2023-12-01',
            purchase_price: 2500000,
            status: 'ACTIVE',
            condition: 'GOOD',
            created_at: '2023-12-01T08:00:00Z',
            updated_at: '2024-01-10T08:00:00Z',
            room: {
              id: 'r2',
              number: '102',
              building: { name: 'Building A' }
            }
          },
          {
            id: '3',
            name: 'Security Camera',
            category: 'ELECTRONICS',
            brand: 'Hikvision',
            model: 'DS-2CD2043G2-I',
            serial_number: 'CAM2024001',
            purchase_date: '2024-01-01',
            purchase_price: 5000000,
            warranty_expiry: '2026-01-01',
            status: 'ACTIVE',
            condition: 'EXCELLENT',
            notes: 'Installed in main lobby',
            created_at: '2024-01-01T08:00:00Z',
            updated_at: '2024-01-01T08:00:00Z'
          },
          {
            id: '4',
            room_id: 'r3',
            name: 'Mini Refrigerator',
            category: 'APPLIANCES',
            brand: 'Samsung',
            model: 'RT13A2658S8',
            serial_number: 'REF2024001',
            purchase_date: '2023-11-15',
            purchase_price: 8000000,
            warranty_expiry: '2025-11-15',
            status: 'MAINTENANCE',
            condition: 'FAIR',
            notes: 'Cooling issue reported',
            created_at: '2023-11-15T08:00:00Z',
            updated_at: '2024-01-10T08:00:00Z',
            room: {
              id: 'r3',
              number: '103',
              building: { name: 'Building A' }
            }
          }
        ];
        setAssets(mockAssets);
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.brand && asset.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (asset.model && asset.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (asset.serial_number && asset.serial_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (asset.room && asset.room.number.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !categoryFilter || asset.category === categoryFilter;
    const matchesStatus = !statusFilter || asset.status === statusFilter;
    const matchesCondition = !conditionFilter || asset.condition === conditionFilter;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesCondition;
  });

  const getStatusColor = (status: keyof typeof ASSET_STATUS) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800';
      case 'RETIRED': return 'bg-red-100 text-red-800';
      case 'LOST': return 'bg-red-100 text-red-800';
      case 'DAMAGED': return 'bg-red-100 text-red-800';
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

  const getCategoryColor = (category: keyof typeof ASSET_CATEGORIES) => {
    switch (category) {
      case 'FURNITURE': return 'bg-brown-100 text-brown-800';
      case 'ELECTRONICS': return 'bg-blue-100 text-blue-800';
      case 'APPLIANCES': return 'bg-green-100 text-green-800';
      case 'FIXTURES': return 'bg-purple-100 text-purple-800';
      case 'VEHICLE': return 'bg-indigo-100 text-indigo-800';
      case 'EQUIPMENT': return 'bg-orange-100 text-orange-800';
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

  const isWarrantyExpiring = (warrantyDate: string) => {
    if (!warrantyDate) return false;
    const expiry = new Date(warrantyDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    return expiry <= thirtyDaysFromNow && expiry >= today;
  };

  const isWarrantyExpired = (warrantyDate: string) => {
    if (!warrantyDate) return false;
    return new Date(warrantyDate) < new Date();
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
          <h1 className="text-2xl font-bold text-gray-900">Assets</h1>
          <p className="text-gray-600">Manage facility assets and equipment inventory</p>
        </div>
        <Link
          to="/student-hotel/assets/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Asset
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by name, brand, model, or serial..."
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
              {Object.entries(ASSET_CATEGORY_LABELS).map(([key, label]) => (
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
              {Object.entries(ASSET_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Conditions</option>
              {Object.entries(ASSET_CONDITION_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
                setStatusFilter('');
                setConditionFilter('');
              }}
              className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Assets List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Warranty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No assets found
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {asset.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {asset.brand && asset.model ? `${asset.brand} ${asset.model}` : asset.brand || asset.model || 'No model info'}
                        </div>
                        {asset.serial_number && (
                          <div className="text-xs text-gray-400">SN: {asset.serial_number}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(asset.category)}`}>
                        {ASSET_CATEGORY_LABELS[asset.category]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {asset.room ? (
                        <div>
                          <div>Room {asset.room.number}</div>
                          <div className="text-gray-500">{asset.room.building.name}</div>
                        </div>
                      ) : (
                        'General/Unassigned'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(asset.status)}`}>
                        {ASSET_STATUS_LABELS[asset.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(asset.condition)}`}>
                        {ASSET_CONDITION_LABELS[asset.condition]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {asset.purchase_date ? (
                        <div>
                          <div>{formatDate(asset.purchase_date)}</div>
                          {asset.purchase_price && (
                            <div className="text-gray-500">{formatCurrency(asset.purchase_price)}</div>
                          )}
                        </div>
                      ) : (
                        'No purchase info'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {asset.warranty_expiry ? (
                        <div className={
                          isWarrantyExpired(asset.warranty_expiry) ? 'text-red-600' :
                          isWarrantyExpiring(asset.warranty_expiry) ? 'text-orange-600' : ''
                        }>
                          {formatDate(asset.warranty_expiry)}
                          {isWarrantyExpired(asset.warranty_expiry) && (
                            <div className="text-xs text-red-500">Expired</div>
                          )}
                          {isWarrantyExpiring(asset.warranty_expiry) && !isWarrantyExpired(asset.warranty_expiry) && (
                            <div className="text-xs text-orange-500">Expiring soon</div>
                          )}
                        </div>
                      ) : (
                        'No warranty info'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/student-hotel/assets/${asset.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        <Link
                          to={`/student-hotel/assets/${asset.id}/edit`}
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
