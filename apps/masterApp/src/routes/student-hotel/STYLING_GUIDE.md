# TailwindCSS + HeroUI Styling Guide

This guide shows how to use TailwindCSS and HeroUI React components in the Student Hotel Management module.

## Setup Complete ✅

The following has been configured:

- **TailwindCSS v3** with PostCSS
- **HeroUI React Components** (successor to NextUI)
- **Custom CSS utilities** for common patterns
- **HeroUI Provider** wrapping the entire app
- **Dark mode support** via `class` strategy

## File Structure

```
apps/masterApp/
├── tailwind.config.js          # TailwindCSS + HeroUI configuration
├── postcss.config.js           # PostCSS configuration
├── src/
│   ├── styles/
│   │   └── globals.css          # TailwindCSS directives + custom utilities
│   ├── components/
│   │   └── providers/
│   │       └── HeroUIProvider.tsx  # HeroUI provider component
│   └── routes/
│       ├── layout.tsx           # Main layout with HeroUI provider
│       └── student-hotel/
│           ├── layout.tsx       # Updated with HeroUI components
│           └── page.tsx         # Dashboard with HeroUI examples
```

## Available HeroUI Components

### Navigation & Layout
```tsx
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem,
  Card,
  CardBody,
  CardHeader
} from '@heroui/react';

// Example usage in layout.tsx
<Navbar isBordered className="bg-blue-600">
  <NavbarBrand>
    <h1 className="text-xl font-bold text-white">Student Hotel Management</h1>
  </NavbarBrand>
</Navbar>
```

### Buttons & Actions
```tsx
import { Button } from '@heroui/react';

// Primary button
<Button color="primary" variant="solid">
  Add Room
</Button>

// Icon button
<Button isIconOnly variant="light" onPress={() => {}}>
  <MenuIcon />
</Button>
```

### Data Display
```tsx
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableColumn, 
  TableRow, 
  TableCell,
  Chip,
  Avatar,
  Pagination
} from '@heroui/react';

// Status chips
<Chip color="success" variant="flat">Available</Chip>
<Chip color="danger" variant="flat">Occupied</Chip>

// User avatar
<Avatar size="sm" name="Admin" />
```

### Forms & Input
```tsx
import { 
  Input, 
  Select, 
  SelectItem, 
  Textarea,
  Checkbox,
  Switch
} from '@heroui/react';

// Form input
<Input
  label="Room Number"
  placeholder="e.g., A101"
  variant="bordered"
/>

// Select dropdown
<Select label="Room Type" placeholder="Select type">
  <SelectItem key="single" value="SINGLE">Single</SelectItem>
  <SelectItem key="double" value="DOUBLE">Double</SelectItem>
</Select>
```

### Feedback & Loading
```tsx
import { 
  Spinner, 
  Progress, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter
} from '@heroui/react';

// Loading spinner
<Spinner size="lg" color="primary" />

// Modal dialog
<Modal isOpen={isOpen} onClose={onClose}>
  <ModalContent>
    <ModalHeader>Create New Room</ModalHeader>
    <ModalBody>
      {/* Form content */}
    </ModalBody>
    <ModalFooter>
      <Button onPress={onClose}>Cancel</Button>
      <Button color="primary">Save</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

## Custom TailwindCSS Utilities

The following custom utilities are available in `globals.css`:

### Component Classes
```css
.btn-primary     /* Blue primary button */
.btn-secondary   /* Gray secondary button */
.card           /* White card with shadow */
.form-input     /* Styled form input */
.form-label     /* Form label styling */
.table-header   /* Table header styling */
.table-cell     /* Table cell styling */
.status-badge   /* Status badge styling */
.sidebar-link   /* Sidebar navigation link */
```

### Usage Examples
```tsx
// Using custom utilities
<div className="card">
  <label className="form-label">Room Number</label>
  <input className="form-input" />
  <button className="btn-primary">Save</button>
</div>

// Combining with HeroUI
<Card className="p-6">
  <Input 
    label="Room Number" 
    classNames={{
      input: "form-input",
      label: "form-label"
    }}
  />
</Card>
```

## Theme Configuration

### Colors
The HeroUI theme is configured with:
- **Primary**: Blue (#006FEE)
- **Light theme**: White background, dark text
- **Dark theme**: Black background, light text
- **Purple-dark theme**: Custom purple theme

### Dark Mode
```tsx
// Toggle dark mode
import { useTheme } from '@heroui/react';

const { theme, setTheme } = useTheme();

<Button onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
  Toggle Theme
</Button>
```

## Best Practices

### 1. Component Composition
```tsx
// Good: Combine HeroUI with TailwindCSS
<Card className="hover:shadow-lg transition-shadow">
  <CardBody>
    <div className="flex items-center gap-4">
      <Avatar name="User" />
      <div className="flex-1">
        <h3 className="font-semibold">Room A101</h3>
        <Chip size="sm" color="success">Available</Chip>
      </div>
    </div>
  </CardBody>
</Card>
```

### 2. Responsive Design
```tsx
// Use TailwindCSS responsive prefixes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {rooms.map(room => (
    <Card key={room.id} className="w-full">
      <CardBody>{/* Room content */}</CardBody>
    </Card>
  ))}
</div>
```

### 3. Form Validation
```tsx
// Combine HeroUI validation with custom styling
<Input
  label="Room Number"
  isInvalid={!!errors.number}
  errorMessage={errors.number}
  classNames={{
    input: "form-input",
    errorMessage: "text-red-500 text-sm"
  }}
/>
```

### 4. Loading States
```tsx
// Consistent loading patterns
{loading ? (
  <div className="flex justify-center p-8">
    <Spinner size="lg" color="primary" />
  </div>
) : (
  <div className="grid gap-4">
    {/* Content */}
  </div>
)}
```

## Migration Notes

- **NextUI → HeroUI**: All `@nextui-org/*` packages have been replaced with `@heroui/*`
- **Import paths**: Update imports from `@nextui-org/react` to `@heroui/react`
- **API compatibility**: HeroUI maintains API compatibility with NextUI v2
- **Deprecation warnings**: NextUI packages show deprecation warnings pointing to HeroUI

## Resources

- [HeroUI Documentation](https://heroui.com/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [HeroUI Components](https://heroui.com/docs/components)
- [TailwindCSS Utilities](https://tailwindcss.com/docs/utility-first)
