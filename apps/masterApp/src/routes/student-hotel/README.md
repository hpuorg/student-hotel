# Student Hotel Management Module

A comprehensive React-based frontend module for managing student hotel operations, integrated with n8n workflow automation.

## Overview

This module provides a complete CRUD interface for managing:
- **Rooms**: Create, view, edit, and delete student accommodation rooms
- **Buildings**: Manage building information and room assignments
- **Students**: Track student information and room assignments
- **Dashboard**: Overview of system statistics and quick actions

## Features

### 🏠 Room Management
- **List View**: Paginated table with advanced filtering
- **Create/Edit**: Form-based room creation and editing
- **Filters**: Status, type, building, price range, room number search
- **Real-time Stats**: Occupancy tracking and availability

### 🏢 Building Management
- **Grid View**: Card-based building display with room statistics
- **Create/Edit**: Building information management
- **Room Integration**: Direct links to building-specific rooms

### 👥 Student Management
- **Student Directory**: Searchable student database
- **Room Assignments**: Track which students are in which rooms
- **Status Tracking**: Active, inactive, graduated, suspended students

### 📊 Dashboard
- **Statistics Cards**: Key metrics at a glance
- **Quick Actions**: Fast access to common tasks
- **Recent Activity**: Latest system updates

## Technical Stack

- **Frontend**: React with TypeScript
- **Routing**: Modern.js Router
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **API Integration**: Custom API client with n8n webhooks

## File Structure

```
src/routes/student-hotel/
├── layout.tsx              # Main layout with sidebar navigation
├── page.tsx                # Dashboard page
├── README.md               # This documentation
├── rooms/
│   ├── page.tsx           # Rooms list and management
│   └── create/
│       └── page.tsx       # Create new room form
├── buildings/
│   ├── page.tsx           # Buildings list and management
│   └── create/
│       └── page.tsx       # Create new building form
└── students/
    └── page.tsx           # Students list and management

src/utils/
└── api.ts                 # API client and utilities
```

## API Integration

### n8n Webhook Endpoints

The module integrates with the following n8n workflow endpoints:

#### Rooms API
- `GET /webhook/rooms` - List rooms with pagination and filters
- `GET /webhook/rooms/:id` - Get single room details
- `POST /webhook/rooms` - Create new room
- `PUT /webhook/rooms/:id` - Update room
- `DELETE /webhook/rooms/:id` - Delete room

#### Buildings API
- `GET /webhook/buildings` - List buildings with pagination
- `POST /webhook/buildings` - Create new building

### API Configuration

Update the API configuration in `src/utils/api.ts`:

```typescript
const API_CONFIG = {
  BASE_URL: 'https://your-n8n-instance.com/webhook',
  DEFAULT_ORG_ID: 'your-org-id',
  TIMEOUT: 30000,
};
```

## Data Models

### Room
```typescript
interface Room {
  id: string;
  number: string;
  building: {
    id: string;
    name: string;
    address: string;
  };
  floor: number;
  type: 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'QUAD' | 'DORMITORY' | 'SUITE';
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED' | 'OUT_OF_ORDER';
  capacity: number;
  current_occupants: number;
  monthly_rate: number;
  daily_rate: number;
  area?: number;
  description?: string;
}
```

### Building
```typescript
interface Building {
  id: string;
  name: string;
  address: string;
  floors: number;
  description?: string;
  rooms?: Room[];
}
```

## Usage

### Navigation

The module uses a sidebar navigation layout with the following routes:

- `/student-hotel` - Dashboard
- `/student-hotel/rooms` - Room management
- `/student-hotel/rooms/create` - Create new room
- `/student-hotel/buildings` - Building management
- `/student-hotel/buildings/create` - Create new building
- `/student-hotel/students` - Student management

### Room Management

1. **Viewing Rooms**: Navigate to `/student-hotel/rooms`
2. **Filtering**: Use the filter bar to search by status, type, building, etc.
3. **Creating**: Click "Add Room" button or navigate to `/student-hotel/rooms/create`
4. **Editing**: Click the edit icon in the actions column
5. **Deleting**: Click the delete icon (with confirmation)

### Building Management

1. **Viewing Buildings**: Navigate to `/student-hotel/buildings`
2. **Creating**: Click "Add Building" button or navigate to `/student-hotel/buildings/create`
3. **Room Statistics**: Each building card shows room availability stats
4. **Editing/Deleting**: Use the action buttons on each building card

## Customization

### Styling

The module uses Tailwind CSS for styling. Key design elements:

- **Color Scheme**: Blue primary, with status-specific colors
- **Layout**: Responsive grid and flexbox layouts
- **Components**: Cards, tables, forms, and modals
- **Icons**: Heroicons SVG icons

### Adding New Features

1. **New Pages**: Create new page components in appropriate directories
2. **API Endpoints**: Add new API functions to `src/utils/api.ts`
3. **Navigation**: Update the sidebar in `layout.tsx`
4. **Types**: Add TypeScript interfaces for new data models

## Error Handling

The module includes comprehensive error handling:

- **API Errors**: Graceful fallback to mock data for development
- **Form Validation**: Client-side validation with error messages
- **Loading States**: Spinner indicators during API calls
- **User Feedback**: Success/error notifications

## Development

### Mock Data

For development without a live n8n instance, the module falls back to mock data when API calls fail. This allows for:

- **Frontend Development**: Work on UI without backend dependencies
- **Testing**: Consistent data for testing scenarios
- **Demos**: Showcase functionality without live data

### Environment Variables

Set the following environment variables:

```bash
# Production n8n webhook URL
REACT_APP_API_BASE_URL=https://your-n8n-instance.com/webhook

# Organization ID
REACT_APP_ORG_ID=your-org-id
```

## Integration with n8n Workflows

This frontend is designed to work with the n8n workflows defined in:
- `kssv/Student-Hotel-room-management (1).json`
- `kssv/Student-Hotel-room-management-htmx-20250712120558.json`

The workflows provide:
- **Database Operations**: CRUD operations via Supabase/PostgreSQL
- **Data Validation**: Server-side validation and business rules
- **Response Formatting**: Consistent API response structure
- **Error Handling**: Proper error responses and logging

## Future Enhancements

Potential improvements and additions:

1. **Real-time Updates**: WebSocket integration for live data updates
2. **Advanced Reporting**: Charts and analytics dashboard
3. **Booking System**: Room reservation and booking management
4. **Payment Integration**: Billing and payment processing
5. **Maintenance Tracking**: Work order and maintenance request system
6. **Mobile App**: React Native mobile application
7. **Notifications**: Email and SMS notification system
8. **Multi-tenancy**: Support for multiple organizations

## Support

For issues and questions:

1. Check the API endpoints are correctly configured
2. Verify n8n workflows are active and accessible
3. Review browser console for error messages
4. Ensure proper CORS configuration on n8n instance
