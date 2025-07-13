// API Configuration and Utilities for Student Hotel Management
import {
  API_CONFIG,
  API_ENDPOINTS,
  ROOM_TYPES,
  ROOM_STATUS,
  ROOM_TYPE_CLASSES,
  ROOM_STATUS_CLASSES,
  ROOM_TYPE_LABELS,
  ROOM_STATUS_LABELS,
  CURRENCY_CONFIG,
  PAGINATION_DEFAULTS,
  RoomType,
  RoomStatus
} from '../constants';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    offset: number;
    totalPages: number;
  };
}

// Room Types
export interface Room {
  id: string;
  number: string;
  building: {
    id: string;
    name: string;
    address: string;
  };
  floor: number;
  type: RoomType;
  status: RoomStatus;
  capacity: number;
  current_occupants: number;
  monthly_rate: number;
  daily_rate: number;
  area?: number;
  description?: string;
  amenities?: any[];
  assets?: any[];
}

export interface CreateRoomData {
  org_id: string;
  number: string;
  building_id: string;
  floor: number;
  type: string;
  capacity: number;
  area?: number;
  monthly_rate: number;
  daily_rate: number;
  description?: string;
  created_by_id: string;
}

export interface RoomFilters {
  org_id?: string;
  status?: string;
  type?: string;
  building_id?: string;
  min_rate?: number;
  max_rate?: number;
  search_number?: string;
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: string;
  include_amenities?: boolean;
  include_assets?: boolean;
}

// Building Types
export interface Building {
  id: string;
  name: string;
  address: string;
  floors: number;
  description?: string;
  rooms?: Room[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateBuildingData {
  org_id: string;
  name: string;
  address: string;
  floors: number;
  description?: string;
}

export interface BuildingFilters {
  org_id?: string;
  search_name?: string;
  limit?: number;
  offset?: number;
  sort_field?: string;
  sort_direction?: string;
  include_rooms?: boolean;
}

// HTTP Client with error handling
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url);
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_CONFIG.BASE_URL);

// Room API functions
export const roomsApi = {
  // Get all rooms with filters
  async getRooms(filters: RoomFilters = {}): Promise<ApiResponse<PaginatedResponse<Room>>> {
    const params = {
      org_id: API_CONFIG.DEFAULT_ORG_ID,
      limit: PAGINATION_DEFAULTS.LIMIT,
      offset: PAGINATION_DEFAULTS.OFFSET,
      sort_by: 'created_at',
      sort_order: 'desc',
      include_amenities: true,
      include_assets: false,
      ...filters,
    };

    // Remove empty values
    Object.keys(params).forEach(key => {
      if (params[key as keyof typeof params] === '' || params[key as keyof typeof params] === undefined) {
        delete params[key as keyof typeof params];
      }
    });

    return apiClient.get<PaginatedResponse<Room>>(API_ENDPOINTS.ROOMS, params);
  },

  // Get single room by ID
  async getRoom(id: string): Promise<ApiResponse<Room>> {
    return apiClient.get<Room>(`${API_ENDPOINTS.ROOMS}/${id}`);
  },

  // Create new room
  async createRoom(data: CreateRoomData): Promise<ApiResponse<Room>> {
    return apiClient.post<Room>(API_ENDPOINTS.ROOMS, data);
  },

  // Update room
  async updateRoom(id: string, data: Partial<CreateRoomData>): Promise<ApiResponse<Room>> {
    return apiClient.put<Room>(`${API_ENDPOINTS.ROOMS}/${id}`, data);
  },

  // Delete room
  async deleteRoom(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${API_ENDPOINTS.ROOMS}/${id}`);
  },
};

// Building API functions
export const buildingsApi = {
  // Get all buildings with filters
  async getBuildings(filters: BuildingFilters = {}): Promise<ApiResponse<PaginatedResponse<Building>>> {
    const params = {
      org_id: API_CONFIG.DEFAULT_ORG_ID,
      limit: PAGINATION_DEFAULTS.LIMIT,
      offset: PAGINATION_DEFAULTS.OFFSET,
      sort_field: 'created_at',
      sort_direction: 'desc',
      include_rooms: false,
      ...filters,
    };

    // Remove empty values
    Object.keys(params).forEach(key => {
      if (params[key as keyof typeof params] === '' || params[key as keyof typeof params] === undefined) {
        delete params[key as keyof typeof params];
      }
    });

    return apiClient.get<PaginatedResponse<Building>>(API_ENDPOINTS.BUILDINGS, params);
  },

  // Get single building by ID
  async getBuilding(id: string): Promise<ApiResponse<Building>> {
    return apiClient.get<Building>(`${API_ENDPOINTS.BUILDINGS}/${id}`);
  },

  // Create new building
  async createBuilding(data: CreateBuildingData): Promise<ApiResponse<Building>> {
    return apiClient.post<Building>(API_ENDPOINTS.BUILDINGS, data);
  },

  // Update building
  async updateBuilding(id: string, data: Partial<CreateBuildingData>): Promise<ApiResponse<Building>> {
    return apiClient.put<Building>(`${API_ENDPOINTS.BUILDINGS}/${id}`, data);
  },

  // Delete building
  async deleteBuilding(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${API_ENDPOINTS.BUILDINGS}/${id}`);
  },
};

// Utility functions
export const utils = {
  // Format currency
  formatCurrency(amount: number, currency = CURRENCY_CONFIG.CURRENCY): string {
    return new Intl.NumberFormat(CURRENCY_CONFIG.LOCALE, {
      style: 'currency',
      currency,
    }).format(amount);
  },

  // Format date
  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString();
  },

  // Get room type display name
  getRoomTypeDisplay(type: string): string {
    return ROOM_TYPE_LABELS[type as keyof typeof ROOM_TYPE_LABELS] || type;
  },

  // Get room status display name
  getRoomStatusDisplay(status: string): string {
    return ROOM_STATUS_LABELS[status as keyof typeof ROOM_STATUS_LABELS] || status;
  },

  // Get CSS classes for room type
  getRoomTypeClass(type: string): string {
    return ROOM_TYPE_CLASSES[type as keyof typeof ROOM_TYPE_CLASSES] || 'bg-gray-100 text-gray-800';
  },

  // Get CSS classes for room status
  getRoomStatusClass(status: string): string {
    return ROOM_STATUS_CLASSES[status as keyof typeof ROOM_STATUS_CLASSES] || 'bg-gray-100 text-gray-800';
  },
};

// Export API configuration for external use
export { API_CONFIG };
