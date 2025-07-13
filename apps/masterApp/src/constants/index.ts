// Application Constants

// API Configuration
export const API_CONFIG = {
  // Replace with your actual n8n webhook URLs
  BASE_URL: 'https://your-n8n-instance.com/webhook',

  // Default organization ID
  DEFAULT_ORG_ID: 'hpu.edu.vn',

  // Request timeout in milliseconds
  TIMEOUT: 30000,
};

// Room Types
export const ROOM_TYPES = {
  SINGLE: 'SINGLE',
  DOUBLE: 'DOUBLE', 
  TRIPLE: 'TRIPLE',
  QUAD: 'QUAD',
  DORMITORY: 'DORMITORY',
  SUITE: 'SUITE',
} as const;

export type RoomType = typeof ROOM_TYPES[keyof typeof ROOM_TYPES];

// Room Status
export const ROOM_STATUS = {
  AVAILABLE: 'AVAILABLE',
  OCCUPIED: 'OCCUPIED',
  MAINTENANCE: 'MAINTENANCE',
  RESERVED: 'RESERVED',
  OUT_OF_ORDER: 'OUT_OF_ORDER',
} as const;

export type RoomStatus = typeof ROOM_STATUS[keyof typeof ROOM_STATUS];

// Student Status
export const STUDENT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  GRADUATED: 'GRADUATED',
  SUSPENDED: 'SUSPENDED',
} as const;

export type StudentStatus = typeof STUDENT_STATUS[keyof typeof STUDENT_STATUS];

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  STUDENT: 'STUDENT',
  GUEST: 'GUEST',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// User Status (same as Student Status for compatibility)
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  PENDING: 'PENDING',
} as const;

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

// Booking Types
export const BOOKING_TYPES = {
  SHORT_TERM: 'SHORT_TERM',
  LONG_TERM: 'LONG_TERM',
} as const;

export type BookingType = typeof BOOKING_TYPES[keyof typeof BOOKING_TYPES];

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CHECKED_IN: 'CHECKED_IN',
  CHECKED_OUT: 'CHECKED_OUT',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW',
} as const;

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];

// Contract Status
export const CONTRACT_STATUS = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  TERMINATED: 'TERMINATED',
  RENEWED: 'RENEWED',
  CANCELLED: 'CANCELLED',
} as const;

export type ContractStatus = typeof CONTRACT_STATUS[keyof typeof CONTRACT_STATUS];

// Payment Types
export const PAYMENT_TYPES = {
  RENT: 'RENT',
  DEPOSIT: 'DEPOSIT',
  FEE: 'FEE',
  FINE: 'FINE',
  REFUND: 'REFUND',
  UTILITIES: 'UTILITIES',
  MAINTENANCE: 'MAINTENANCE',
  LATE_FEE: 'LATE_FEE',
  OTHER: 'OTHER',
} as const;

export type PaymentType = typeof PAYMENT_TYPES[keyof typeof PAYMENT_TYPES];

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'CASH',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CREDIT_CARD: 'CREDIT_CARD',
  DEBIT_CARD: 'DEBIT_CARD',
  ONLINE_PAYMENT: 'ONLINE_PAYMENT',
  MOBILE_PAYMENT: 'MOBILE_PAYMENT',
} as const;

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

// Support Request Types
export const SUPPORT_REQUEST_TYPES = {
  MAINTENANCE: 'MAINTENANCE',
  COMPLAINT: 'COMPLAINT',
  INQUIRY: 'INQUIRY',
  SERVICE_REQUEST: 'SERVICE_REQUEST',
  EMERGENCY: 'EMERGENCY',
  CLEANING: 'CLEANING',
  NOISE_COMPLAINT: 'NOISE_COMPLAINT',
  SECURITY: 'SECURITY',
  INTERNET: 'INTERNET',
  FACILITIES: 'FACILITIES',
  OTHER: 'OTHER',
} as const;

export type SupportRequestType = typeof SUPPORT_REQUEST_TYPES[keyof typeof SUPPORT_REQUEST_TYPES];

// Support Request Status
export const SUPPORT_REQUEST_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
  CANCELLED: 'CANCELLED',
} as const;

export type SupportRequestStatus = typeof SUPPORT_REQUEST_STATUS[keyof typeof SUPPORT_REQUEST_STATUS];

// Support Request Priority (alias for Priority Levels)
export const SUPPORT_REQUEST_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

export type SupportRequestPriority = typeof SUPPORT_REQUEST_PRIORITY[keyof typeof SUPPORT_REQUEST_PRIORITY];

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

export type Priority = typeof PRIORITY_LEVELS[keyof typeof PRIORITY_LEVELS];

// Maintenance Request Status
export const MAINTENANCE_REQUEST_STATUS = {
  PENDING: 'PENDING',
  SCHEDULED: 'SCHEDULED',
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  ON_HOLD: 'ON_HOLD',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type MaintenanceRequestStatus = typeof MAINTENANCE_REQUEST_STATUS[keyof typeof MAINTENANCE_REQUEST_STATUS];

// Maintenance Status (alias for compatibility)
export const MAINTENANCE_STATUS = MAINTENANCE_REQUEST_STATUS;
export type MaintenanceStatus = MaintenanceRequestStatus;

// Maintenance Categories
export const MAINTENANCE_CATEGORIES = {
  PLUMBING: 'PLUMBING',
  ELECTRICAL: 'ELECTRICAL',
  HVAC: 'HVAC',
  FURNITURE: 'FURNITURE',
  APPLIANCE: 'APPLIANCE',
  STRUCTURAL: 'STRUCTURAL',
  CLEANING: 'CLEANING',
  SECURITY: 'SECURITY',
  OTHER: 'OTHER',
} as const;

export type MaintenanceCategory = typeof MAINTENANCE_CATEGORIES[keyof typeof MAINTENANCE_CATEGORIES];

// Maintenance Priority (alias for Priority Levels)
export const MAINTENANCE_PRIORITY = PRIORITY_LEVELS;
export type MaintenancePriority = Priority;

// Asset Categories
export const ASSET_CATEGORIES = {
  FURNITURE: 'FURNITURE',
  ELECTRONICS: 'ELECTRONICS',
  APPLIANCES: 'APPLIANCES',
  FIXTURES: 'FIXTURES',
  SAFETY: 'SAFETY',
  CLEANING: 'CLEANING',
  HVAC: 'HVAC',
  SECURITY: 'SECURITY',
  VEHICLE: 'VEHICLE',
  EQUIPMENT: 'EQUIPMENT',
  OTHER: 'OTHER',
} as const;

export type AssetCategory = typeof ASSET_CATEGORIES[keyof typeof ASSET_CATEGORIES];

// Asset Status
export const ASSET_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  MAINTENANCE: 'MAINTENANCE',
  RETIRED: 'RETIRED',
  DAMAGED: 'DAMAGED',
  LOST: 'LOST',
} as const;

export type AssetStatus = typeof ASSET_STATUS[keyof typeof ASSET_STATUS];

// Asset Condition
export const ASSET_CONDITIONS = {
  EXCELLENT: 'EXCELLENT',
  GOOD: 'GOOD',
  FAIR: 'FAIR',
  POOR: 'POOR',
  DAMAGED: 'DAMAGED',
} as const;

export type AssetCondition = typeof ASSET_CONDITIONS[keyof typeof ASSET_CONDITIONS];

// Expense Categories
export const EXPENSE_CATEGORIES = {
  UTILITIES: 'UTILITIES',
  MAINTENANCE: 'MAINTENANCE',
  SUPPLIES: 'SUPPLIES',
  STAFF_SALARY: 'STAFF_SALARY',
  INSURANCE: 'INSURANCE',
  MARKETING: 'MARKETING',
  ADMINISTRATIVE: 'ADMINISTRATIVE',
  EQUIPMENT: 'EQUIPMENT',
  SERVICES: 'SERVICES',
  TRAVEL: 'TRAVEL',
  OTHER: 'OTHER',
} as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[keyof typeof EXPENSE_CATEGORIES];

// Expense Status
export const EXPENSE_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
} as const;

export type ExpenseStatus = typeof EXPENSE_STATUS[keyof typeof EXPENSE_STATUS];

// Work Report Status
export const WORK_REPORT_STATUS = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type WorkReportStatus = typeof WORK_REPORT_STATUS[keyof typeof WORK_REPORT_STATUS];

// Notification Types
export const NOTIFICATION_TYPES = {
  PAYMENT_DUE: 'PAYMENT_DUE',
  PAYMENT_REMINDER: 'PAYMENT_REMINDER',
  CONTRACT_EXPIRING: 'CONTRACT_EXPIRING',
  MAINTENANCE_SCHEDULED: 'MAINTENANCE_SCHEDULED',
  MAINTENANCE_UPDATE: 'MAINTENANCE_UPDATE',
  BOOKING_CONFIRMED: 'BOOKING_CONFIRMED',
  BOOKING_CONFIRMATION: 'BOOKING_CONFIRMATION',
  SUPPORT_REQUEST_UPDATE: 'SUPPORT_REQUEST_UPDATE',
  SYSTEM_ANNOUNCEMENT: 'SYSTEM_ANNOUNCEMENT',
  EMERGENCY_ALERT: 'EMERGENCY_ALERT',
  GENERAL: 'GENERAL',
  OTHER: 'OTHER',
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

// Notification Status
export const NOTIFICATION_STATUS = {
  UNREAD: 'UNREAD',
  READ: 'READ',
  ARCHIVED: 'ARCHIVED',
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  SENT: 'SENT',
  FAILED: 'FAILED',
} as const;

export type NotificationStatus = typeof NOTIFICATION_STATUS[keyof typeof NOTIFICATION_STATUS];

// Default Pagination
export const PAGINATION_DEFAULTS = {
  LIMIT: 10,
  PAGE: 1,
  OFFSET: 0,
};

// Room Type Display Names
export const ROOM_TYPE_LABELS = {
  [ROOM_TYPES.SINGLE]: 'Single Room',
  [ROOM_TYPES.DOUBLE]: 'Double Room',
  [ROOM_TYPES.TRIPLE]: 'Triple Room',
  [ROOM_TYPES.QUAD]: 'Quad Room',
  [ROOM_TYPES.DORMITORY]: 'Dormitory',
  [ROOM_TYPES.SUITE]: 'Suite',
};

// Room Status Display Names
export const ROOM_STATUS_LABELS = {
  [ROOM_STATUS.AVAILABLE]: 'Available',
  [ROOM_STATUS.OCCUPIED]: 'Occupied',
  [ROOM_STATUS.MAINTENANCE]: 'Under Maintenance',
  [ROOM_STATUS.RESERVED]: 'Reserved',
  [ROOM_STATUS.OUT_OF_ORDER]: 'Out of Order',
};

// Student Status Display Names
export const STUDENT_STATUS_LABELS = {
  [STUDENT_STATUS.ACTIVE]: 'Active',
  [STUDENT_STATUS.INACTIVE]: 'Inactive',
  [STUDENT_STATUS.GRADUATED]: 'Graduated',
  [STUDENT_STATUS.SUSPENDED]: 'Suspended',
};

// User Role Display Names
export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrator',
  [USER_ROLES.STAFF]: 'Staff',
  [USER_ROLES.STUDENT]: 'Student',
  [USER_ROLES.GUEST]: 'Guest',
};

// User Status Display Names
export const USER_STATUS_LABELS = {
  [USER_STATUS.ACTIVE]: 'Active',
  [USER_STATUS.INACTIVE]: 'Inactive',
  [USER_STATUS.SUSPENDED]: 'Suspended',
  [USER_STATUS.PENDING]: 'Pending',
};

// Booking Type Display Names
export const BOOKING_TYPE_LABELS = {
  [BOOKING_TYPES.SHORT_TERM]: 'Short Term',
  [BOOKING_TYPES.LONG_TERM]: 'Long Term',
};

// Booking Status Display Names
export const BOOKING_STATUS_LABELS = {
  [BOOKING_STATUS.PENDING]: 'Pending',
  [BOOKING_STATUS.CONFIRMED]: 'Confirmed',
  [BOOKING_STATUS.CHECKED_IN]: 'Checked In',
  [BOOKING_STATUS.CHECKED_OUT]: 'Checked Out',
  [BOOKING_STATUS.CANCELLED]: 'Cancelled',
  [BOOKING_STATUS.NO_SHOW]: 'No Show',
};

// Contract Status Display Names
export const CONTRACT_STATUS_LABELS = {
  [CONTRACT_STATUS.DRAFT]: 'Draft',
  [CONTRACT_STATUS.ACTIVE]: 'Active',
  [CONTRACT_STATUS.EXPIRED]: 'Expired',
  [CONTRACT_STATUS.TERMINATED]: 'Terminated',
  [CONTRACT_STATUS.RENEWED]: 'Renewed',
  [CONTRACT_STATUS.CANCELLED]: 'Cancelled',
};

// Payment Type Display Names
export const PAYMENT_TYPE_LABELS = {
  [PAYMENT_TYPES.RENT]: 'Rent',
  [PAYMENT_TYPES.DEPOSIT]: 'Deposit',
  [PAYMENT_TYPES.FEE]: 'Fee',
  [PAYMENT_TYPES.FINE]: 'Fine',
  [PAYMENT_TYPES.REFUND]: 'Refund',
  [PAYMENT_TYPES.UTILITIES]: 'Utilities',
  [PAYMENT_TYPES.MAINTENANCE]: 'Maintenance',
  [PAYMENT_TYPES.LATE_FEE]: 'Late Fee',
  [PAYMENT_TYPES.OTHER]: 'Other',
};

// Payment Status Display Names
export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: 'Pending',
  [PAYMENT_STATUS.COMPLETED]: 'Completed',
  [PAYMENT_STATUS.FAILED]: 'Failed',
  [PAYMENT_STATUS.CANCELLED]: 'Cancelled',
  [PAYMENT_STATUS.REFUNDED]: 'Refunded',
};

// Payment Method Display Names
export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CASH]: 'Cash',
  [PAYMENT_METHODS.BANK_TRANSFER]: 'Bank Transfer',
  [PAYMENT_METHODS.CREDIT_CARD]: 'Credit Card',
  [PAYMENT_METHODS.DEBIT_CARD]: 'Debit Card',
  [PAYMENT_METHODS.ONLINE_PAYMENT]: 'Online Payment',
  [PAYMENT_METHODS.MOBILE_PAYMENT]: 'Mobile Payment',
};

// Support Request Type Display Names
export const SUPPORT_REQUEST_TYPE_LABELS = {
  [SUPPORT_REQUEST_TYPES.MAINTENANCE]: 'Maintenance',
  [SUPPORT_REQUEST_TYPES.COMPLAINT]: 'Complaint',
  [SUPPORT_REQUEST_TYPES.INQUIRY]: 'Inquiry',
  [SUPPORT_REQUEST_TYPES.SERVICE_REQUEST]: 'Service Request',
  [SUPPORT_REQUEST_TYPES.EMERGENCY]: 'Emergency',
  [SUPPORT_REQUEST_TYPES.CLEANING]: 'Cleaning',
  [SUPPORT_REQUEST_TYPES.NOISE_COMPLAINT]: 'Noise Complaint',
  [SUPPORT_REQUEST_TYPES.SECURITY]: 'Security',
  [SUPPORT_REQUEST_TYPES.INTERNET]: 'Internet',
  [SUPPORT_REQUEST_TYPES.FACILITIES]: 'Facilities',
  [SUPPORT_REQUEST_TYPES.OTHER]: 'Other',
};

// Support Request Status Display Names
export const SUPPORT_REQUEST_STATUS_LABELS = {
  [SUPPORT_REQUEST_STATUS.OPEN]: 'Open',
  [SUPPORT_REQUEST_STATUS.IN_PROGRESS]: 'In Progress',
  [SUPPORT_REQUEST_STATUS.RESOLVED]: 'Resolved',
  [SUPPORT_REQUEST_STATUS.CLOSED]: 'Closed',
  [SUPPORT_REQUEST_STATUS.CANCELLED]: 'Cancelled',
};

// Priority Level Display Names
export const PRIORITY_LEVEL_LABELS = {
  [PRIORITY_LEVELS.LOW]: 'Low',
  [PRIORITY_LEVELS.MEDIUM]: 'Medium',
  [PRIORITY_LEVELS.HIGH]: 'High',
  [PRIORITY_LEVELS.URGENT]: 'Urgent',
};

// Support Request Priority Display Names (alias for Priority Level Labels)
export const SUPPORT_REQUEST_PRIORITY_LABELS = PRIORITY_LEVEL_LABELS;

// Maintenance Request Status Display Names
export const MAINTENANCE_REQUEST_STATUS_LABELS = {
  [MAINTENANCE_REQUEST_STATUS.PENDING]: 'Pending',
  [MAINTENANCE_REQUEST_STATUS.SCHEDULED]: 'Scheduled',
  [MAINTENANCE_REQUEST_STATUS.OPEN]: 'Open',
  [MAINTENANCE_REQUEST_STATUS.IN_PROGRESS]: 'In Progress',
  [MAINTENANCE_REQUEST_STATUS.ON_HOLD]: 'On Hold',
  [MAINTENANCE_REQUEST_STATUS.COMPLETED]: 'Completed',
  [MAINTENANCE_REQUEST_STATUS.CANCELLED]: 'Cancelled',
};

// Maintenance Status Labels (alias for compatibility)
export const MAINTENANCE_STATUS_LABELS = MAINTENANCE_REQUEST_STATUS_LABELS;

// Maintenance Category Display Names
export const MAINTENANCE_CATEGORY_LABELS = {
  [MAINTENANCE_CATEGORIES.PLUMBING]: 'Plumbing',
  [MAINTENANCE_CATEGORIES.ELECTRICAL]: 'Electrical',
  [MAINTENANCE_CATEGORIES.HVAC]: 'HVAC',
  [MAINTENANCE_CATEGORIES.FURNITURE]: 'Furniture',
  [MAINTENANCE_CATEGORIES.APPLIANCE]: 'Appliance',
  [MAINTENANCE_CATEGORIES.STRUCTURAL]: 'Structural',
  [MAINTENANCE_CATEGORIES.CLEANING]: 'Cleaning',
  [MAINTENANCE_CATEGORIES.SECURITY]: 'Security',
  [MAINTENANCE_CATEGORIES.OTHER]: 'Other',
};

// Maintenance Priority Display Names (alias for Priority Level Labels)
export const MAINTENANCE_PRIORITY_LABELS = PRIORITY_LEVEL_LABELS;

// Asset Category Display Names
export const ASSET_CATEGORY_LABELS = {
  [ASSET_CATEGORIES.FURNITURE]: 'Furniture',
  [ASSET_CATEGORIES.ELECTRONICS]: 'Electronics',
  [ASSET_CATEGORIES.APPLIANCES]: 'Appliances',
  [ASSET_CATEGORIES.FIXTURES]: 'Fixtures',
  [ASSET_CATEGORIES.SAFETY]: 'Safety Equipment',
  [ASSET_CATEGORIES.CLEANING]: 'Cleaning Equipment',
  [ASSET_CATEGORIES.HVAC]: 'HVAC',
  [ASSET_CATEGORIES.SECURITY]: 'Security',
  [ASSET_CATEGORIES.VEHICLE]: 'Vehicle',
  [ASSET_CATEGORIES.EQUIPMENT]: 'Equipment',
  [ASSET_CATEGORIES.OTHER]: 'Other',
};

// Asset Status Display Names
export const ASSET_STATUS_LABELS = {
  [ASSET_STATUS.ACTIVE]: 'Active',
  [ASSET_STATUS.INACTIVE]: 'Inactive',
  [ASSET_STATUS.MAINTENANCE]: 'Under Maintenance',
  [ASSET_STATUS.RETIRED]: 'Retired',
  [ASSET_STATUS.DAMAGED]: 'Damaged',
  [ASSET_STATUS.LOST]: 'Lost',
};

// Asset Condition Display Names
export const ASSET_CONDITION_LABELS = {
  [ASSET_CONDITIONS.EXCELLENT]: 'Excellent',
  [ASSET_CONDITIONS.GOOD]: 'Good',
  [ASSET_CONDITIONS.FAIR]: 'Fair',
  [ASSET_CONDITIONS.POOR]: 'Poor',
  [ASSET_CONDITIONS.DAMAGED]: 'Damaged',
};

// Expense Category Display Names
export const EXPENSE_CATEGORY_LABELS = {
  [EXPENSE_CATEGORIES.UTILITIES]: 'Utilities',
  [EXPENSE_CATEGORIES.MAINTENANCE]: 'Maintenance',
  [EXPENSE_CATEGORIES.SUPPLIES]: 'Supplies',
  [EXPENSE_CATEGORIES.STAFF_SALARY]: 'Staff Salary',
  [EXPENSE_CATEGORIES.INSURANCE]: 'Insurance',
  [EXPENSE_CATEGORIES.MARKETING]: 'Marketing',
  [EXPENSE_CATEGORIES.ADMINISTRATIVE]: 'Administrative',
  [EXPENSE_CATEGORIES.EQUIPMENT]: 'Equipment',
  [EXPENSE_CATEGORIES.SERVICES]: 'Services',
  [EXPENSE_CATEGORIES.TRAVEL]: 'Travel',
  [EXPENSE_CATEGORIES.OTHER]: 'Other',
};

// Expense Status Display Names
export const EXPENSE_STATUS_LABELS = {
  [EXPENSE_STATUS.PENDING]: 'Pending',
  [EXPENSE_STATUS.APPROVED]: 'Approved',
  [EXPENSE_STATUS.REJECTED]: 'Rejected',
  [EXPENSE_STATUS.PAID]: 'Paid',
  [EXPENSE_STATUS.CANCELLED]: 'Cancelled',
};

// Work Report Status Display Names
export const WORK_REPORT_STATUS_LABELS = {
  [WORK_REPORT_STATUS.DRAFT]: 'Draft',
  [WORK_REPORT_STATUS.PENDING]: 'Pending',
  [WORK_REPORT_STATUS.SUBMITTED]: 'Submitted',
  [WORK_REPORT_STATUS.APPROVED]: 'Approved',
  [WORK_REPORT_STATUS.REJECTED]: 'Rejected',
};

// Notification Type Display Names
export const NOTIFICATION_TYPE_LABELS = {
  [NOTIFICATION_TYPES.PAYMENT_DUE]: 'Payment Due',
  [NOTIFICATION_TYPES.PAYMENT_REMINDER]: 'Payment Reminder',
  [NOTIFICATION_TYPES.CONTRACT_EXPIRING]: 'Contract Expiring',
  [NOTIFICATION_TYPES.MAINTENANCE_SCHEDULED]: 'Maintenance Scheduled',
  [NOTIFICATION_TYPES.MAINTENANCE_UPDATE]: 'Maintenance Update',
  [NOTIFICATION_TYPES.BOOKING_CONFIRMED]: 'Booking Confirmed',
  [NOTIFICATION_TYPES.BOOKING_CONFIRMATION]: 'Booking Confirmation',
  [NOTIFICATION_TYPES.SUPPORT_REQUEST_UPDATE]: 'Support Request Update',
  [NOTIFICATION_TYPES.SYSTEM_ANNOUNCEMENT]: 'System Announcement',
  [NOTIFICATION_TYPES.EMERGENCY_ALERT]: 'Emergency Alert',
  [NOTIFICATION_TYPES.GENERAL]: 'General',
  [NOTIFICATION_TYPES.OTHER]: 'Other',
};

// Notification Status Display Names
export const NOTIFICATION_STATUS_LABELS = {
  [NOTIFICATION_STATUS.UNREAD]: 'Unread',
  [NOTIFICATION_STATUS.READ]: 'Read',
  [NOTIFICATION_STATUS.ARCHIVED]: 'Archived',
  [NOTIFICATION_STATUS.DRAFT]: 'Draft',
  [NOTIFICATION_STATUS.SCHEDULED]: 'Scheduled',
  [NOTIFICATION_STATUS.SENT]: 'Sent',
  [NOTIFICATION_STATUS.FAILED]: 'Failed',
};

// CSS Classes for Room Types
export const ROOM_TYPE_CLASSES = {
  [ROOM_TYPES.SINGLE]: 'bg-blue-100 text-blue-800',
  [ROOM_TYPES.DOUBLE]: 'bg-green-100 text-green-800',
  [ROOM_TYPES.TRIPLE]: 'bg-yellow-100 text-yellow-800',
  [ROOM_TYPES.QUAD]: 'bg-purple-100 text-purple-800',
  [ROOM_TYPES.DORMITORY]: 'bg-indigo-100 text-indigo-800',
  [ROOM_TYPES.SUITE]: 'bg-pink-100 text-pink-800',
};

// CSS Classes for Room Status
export const ROOM_STATUS_CLASSES = {
  [ROOM_STATUS.AVAILABLE]: 'bg-green-100 text-green-800',
  [ROOM_STATUS.OCCUPIED]: 'bg-red-100 text-red-800',
  [ROOM_STATUS.MAINTENANCE]: 'bg-yellow-100 text-yellow-800',
  [ROOM_STATUS.RESERVED]: 'bg-blue-100 text-blue-800',
  [ROOM_STATUS.OUT_OF_ORDER]: 'bg-gray-100 text-gray-800',
};

// CSS Classes for Student Status
export const STUDENT_STATUS_CLASSES = {
  [STUDENT_STATUS.ACTIVE]: 'bg-green-100 text-green-800',
  [STUDENT_STATUS.INACTIVE]: 'bg-gray-100 text-gray-800',
  [STUDENT_STATUS.GRADUATED]: 'bg-blue-100 text-blue-800',
  [STUDENT_STATUS.SUSPENDED]: 'bg-red-100 text-red-800',
};

// Default Room Capacity by Type
export const DEFAULT_ROOM_CAPACITY = {
  [ROOM_TYPES.SINGLE]: 1,
  [ROOM_TYPES.DOUBLE]: 2,
  [ROOM_TYPES.TRIPLE]: 3,
  [ROOM_TYPES.QUAD]: 4,
  [ROOM_TYPES.DORMITORY]: 6,
  [ROOM_TYPES.SUITE]: 4,
};

// API Endpoints
export const API_ENDPOINTS = {
  ROOMS: '/rooms',
  BUILDINGS: '/buildings',
  STUDENTS: '/students',
  BOOKINGS: '/bookings',
};

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be no more than ${max} characters`,
  MIN_VALUE: (min: number) => `Must be at least ${min}`,
  MAX_VALUE: (max: number) => `Must be no more than ${max}`,
  POSITIVE_NUMBER: 'Must be a positive number',
  INVALID_FORMAT: 'Invalid format',
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  DATETIME: 'MMM dd, yyyy HH:mm',
  TIME: 'HH:mm',
};

// Currency Configuration
export const CURRENCY_CONFIG = {
  CURRENCY: 'USD',
  LOCALE: 'en-US',
  SYMBOL: '$',
};

// Navigation Routes
export const ROUTES = {
  DASHBOARD: '/student-hotel',
  ROOMS: '/student-hotel/rooms',
  ROOMS_CREATE: '/student-hotel/rooms/create',
  BUILDINGS: '/student-hotel/buildings',
  BUILDINGS_CREATE: '/student-hotel/buildings/create',
  STUDENTS: '/student-hotel/students',
  STUDENTS_CREATE: '/student-hotel/students/create',
  BOOKINGS: '/student-hotel/bookings',
  REPORTS: '/student-hotel/reports',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'student_hotel_user_preferences',
  FILTERS: 'student_hotel_filters',
  PAGINATION: 'student_hotel_pagination',
};

// Feature Flags
export const FEATURES = {
  ENABLE_NOTIFICATIONS: true,
  ENABLE_DARK_MODE: false,
  ENABLE_ANALYTICS: true,
  ENABLE_EXPORT: true,
};

// Application Metadata
export const APP_INFO = {
  NAME: 'Student Hotel Management',
  VERSION: '1.0.0',
  DESCRIPTION: 'Comprehensive student accommodation management system',
  COPYRIGHT: '© 2024 Student Hotel Management',
};

// Default export for compatibility
export default {
  API_CONFIG,
  ROOM_TYPES,
  ROOM_STATUS,
  STUDENT_STATUS,
  USER_ROLES,
  USER_STATUS,
  BOOKING_TYPES,
  BOOKING_STATUS,
  CONTRACT_STATUS,
  PAYMENT_TYPES,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  SUPPORT_REQUEST_TYPES,
  SUPPORT_REQUEST_STATUS,
  SUPPORT_REQUEST_PRIORITY,
  PRIORITY_LEVELS,
  MAINTENANCE_STATUS,
  MAINTENANCE_REQUEST_STATUS,
  MAINTENANCE_CATEGORIES,
  ASSET_CATEGORIES,
  ASSET_STATUS,
  ASSET_CONDITIONS,
  EXPENSE_CATEGORIES,
  EXPENSE_STATUS,
  MAINTENANCE_PRIORITY,
  WORK_REPORT_STATUS,
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUS,
  PAGINATION_DEFAULTS,
  ROOM_TYPE_LABELS,
  ROOM_STATUS_LABELS,
  STUDENT_STATUS_LABELS,
  USER_ROLE_LABELS,
  USER_STATUS_LABELS,
  BOOKING_TYPE_LABELS,
  BOOKING_STATUS_LABELS,
  CONTRACT_STATUS_LABELS,
  PAYMENT_TYPE_LABELS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  SUPPORT_REQUEST_TYPE_LABELS,
  SUPPORT_REQUEST_STATUS_LABELS,
  SUPPORT_REQUEST_PRIORITY_LABELS,
  PRIORITY_LEVEL_LABELS,
  MAINTENANCE_STATUS_LABELS,
  MAINTENANCE_REQUEST_STATUS_LABELS,
  MAINTENANCE_CATEGORY_LABELS,
  MAINTENANCE_PRIORITY_LABELS,
  ASSET_CATEGORY_LABELS,
  ASSET_STATUS_LABELS,
  ASSET_CONDITION_LABELS,
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_STATUS_LABELS,
  WORK_REPORT_STATUS_LABELS,
  NOTIFICATION_TYPE_LABELS,
  NOTIFICATION_STATUS_LABELS,
  ROOM_TYPE_CLASSES,
  ROOM_STATUS_CLASSES,
  STUDENT_STATUS_CLASSES,
  DEFAULT_ROOM_CAPACITY,
  API_ENDPOINTS,
  VALIDATION_MESSAGES,
  DATE_FORMATS,
  CURRENCY_CONFIG,
  ROUTES,
  STORAGE_KEYS,
  FEATURES,
  APP_INFO,
};
