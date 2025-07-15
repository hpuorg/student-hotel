# Dark Theme Layout Implementation

This implementation provides a comprehensive dark theme layout system that matches the modern dashboard interface you requested. The system includes a collapsible sidebar, header with search functionality, and an integrated chat interface.

## 🌟 Features

### Core Components
- **Dark Theme Layout**: Complete dark-themed layout wrapper
- **Collapsible Sidebar**: Navigation sidebar with icons and labels
- **Modern Header**: Search bar, notifications, and user controls
- **Chat Interface**: AI assistant chat with message history
- **Theme Provider**: Context-based theme switching system

### UI/UX Features
- **Responsive Design**: Mobile-first approach with breakpoint handling
- **Smooth Animations**: Transitions for sidebar collapse/expand
- **Theme Switching**: Toggle between light and dark modes
- **Modern Styling**: Glass morphism effects and modern color palette
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 📁 File Structure

```
apps/masterApp/src/
├── components/
│   ├── layout/
│   │   ├── DarkThemeLayout.tsx    # Main layout wrapper
│   │   ├── DarkSidebar.tsx        # Sidebar navigation
│   │   ├── DarkHeader.tsx         # Header with search
│   │   └── ChatInterface.tsx      # Chat component
│   └── providers/
│       ├── ThemeProvider.tsx      # Theme context
│       └── HeroUIProvider.tsx     # Updated with theme
├── routes/
│   └── dark-theme/
│       ├── layout.tsx             # Route layout
│       └── page.tsx               # Demo page
└── styles/
    └── globals.css                # Dark theme styles
```

## 🚀 Usage

### 1. Access the Dark Theme Demo
Navigate to `/dark-theme` to see the complete dark theme implementation.

### 2. Using the Layout in Your Routes
```tsx
import DarkThemeLayout from '../../components/layout/DarkThemeLayout';

export default function YourLayout() {
  return <DarkThemeLayout />;
}
```

### 3. Theme Switching
```tsx
import { useTheme } from '../components/providers/ThemeProvider';

function YourComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'dark' ? 'light' : 'dark'} mode
    </button>
  );
}
```

## 🎨 Design System

### Color Palette
- **Primary Background**: `#0a0a0a` (dark-bg-primary)
- **Secondary Background**: `#1a1a1a` (dark-bg-secondary)
- **Tertiary Background**: `#2a2a2a` (dark-bg-tertiary)
- **Primary Text**: `#ffffff` (dark-text-primary)
- **Secondary Text**: `#e5e5e5` (dark-text-secondary)
- **Tertiary Text**: `#a3a3a3` (dark-text-tertiary)

### Components
- **Sidebar**: Collapsible navigation with icons and labels
- **Header**: Search functionality, notifications, user menu
- **Chat**: Real-time chat interface with AI assistant
- **Cards**: Dark-themed content containers
- **Buttons**: Consistent styling across all variants

## 🔧 Configuration

### TailwindCSS Configuration
The `tailwind.config.js` has been updated with:
- Dark theme color palette
- Custom animations
- HeroUI theme configuration
- Extended color system

### Theme Provider Setup
The theme provider is integrated into the HeroUI provider and automatically:
- Detects system preference
- Saves user preference to localStorage
- Applies theme classes to document root
- Provides theme context to all components

## 📱 Responsive Behavior

### Desktop (lg+)
- Sidebar always visible
- Collapsible sidebar functionality
- Chat panel slides in from right
- Full header with all controls

### Tablet (md-lg)
- Sidebar hidden by default
- Mobile sidebar overlay
- Simplified header
- Chat panel overlay

### Mobile (sm)
- Mobile-first sidebar
- Compact header
- Touch-optimized interactions
- Stacked layout

## 🎯 Key Features Implemented

### 1. Sidebar Navigation
- **Collapsible**: Toggle between expanded and collapsed states
- **Icons**: SVG icons for all menu items
- **Active States**: Highlight current route
- **User Profile**: Bottom section with user info and theme toggle

### 2. Header Functionality
- **Search Bar**: Global search with proper styling
- **Notifications**: Badge indicators for alerts
- **User Menu**: Dropdown with profile options
- **Chat Toggle**: Button to open/close chat interface

### 3. Chat Interface
- **Message History**: Scrollable message list
- **Real-time Typing**: Typing indicators
- **Message Types**: Support for different message types
- **Input Controls**: Send button and keyboard shortcuts

### 4. Theme System
- **Context Provider**: React context for theme state
- **Persistence**: localStorage for user preference
- **System Detection**: Automatic dark/light mode detection
- **Smooth Transitions**: CSS transitions for theme changes

## 🔄 Integration Steps

1. **Import the Layout**: Use `DarkThemeLayout` in your route layouts
2. **Configure Routes**: Set up routes that use the dark theme
3. **Customize Navigation**: Update sidebar items in `DarkSidebar.tsx`
4. **Style Components**: Use the dark theme color classes
5. **Test Responsiveness**: Verify mobile and desktop behavior

## 🎨 Customization

### Adding New Sidebar Items
Edit the `sidebarItems` array in `DarkSidebar.tsx`:
```tsx
{
  id: 'new-item',
  label: 'New Item',
  icon: <YourIcon />,
  path: '/your-path',
}
```

### Customizing Colors
Update the color palette in `tailwind.config.js`:
```js
'dark-bg': {
  primary: '#your-color',
  secondary: '#your-color',
  tertiary: '#your-color',
}
```

### Extending Chat Functionality
Modify `ChatInterface.tsx` to add:
- File uploads
- Voice messages
- Custom message types
- Integration with real AI services

This implementation provides a solid foundation for a modern dark theme interface that can be easily customized and extended for your specific needs.
