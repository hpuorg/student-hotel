import React, { useState } from 'react';
import { 
  Navbar, 
  NavbarContent, 
  NavbarItem, 
  Input, 
  Button, 
  Badge,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar
} from '@heroui/react';

interface DarkHeaderProps {
  onToggleSidebar?: () => void;
  onToggleChat?: () => void;
  isChatOpen?: boolean;
}

export function DarkHeader({ onToggleSidebar, onToggleChat, isChatOpen = false }: DarkHeaderProps) {
  const [searchValue, setSearchValue] = useState('');

  return (
    <Navbar
      isBordered
      className="bg-dark-bg-primary border-b border-dark-bg-tertiary"
      classNames={{
        wrapper: "max-w-full px-4",
        content: "text-dark-text-primary"
      }}
    >
      {/* Left Section */}
      <NavbarContent justify="start" className="flex-1">
        <NavbarItem>
          <Button
            isIconOnly
            variant="light"
            onPress={onToggleSidebar}
            className="text-dark-text-secondary hover:text-dark-text-primary lg:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </NavbarItem>

        <NavbarItem>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="text-lg font-semibold text-dark-text-primary">KI-Assistant</span>
          </div>
        </NavbarItem>
      </NavbarContent>

      {/* Center Section - Search */}
      <NavbarContent justify="center" className="flex-1 max-w-md">
        <NavbarItem className="w-full">
          <Input
            placeholder="Search..."
            value={searchValue}
            onValueChange={setSearchValue}
            startContent={
              <svg className="w-4 h-4 text-dark-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
            classNames={{
              base: "w-full",
              mainWrapper: "w-full",
              input: "text-dark-text-primary placeholder:text-dark-text-tertiary",
              inputWrapper: "bg-dark-bg-secondary border-dark-bg-tertiary hover:border-dark-text-tertiary focus-within:border-blue-500"
            }}
            size="sm"
          />
        </NavbarItem>
      </NavbarContent>

      {/* Right Section */}
      <NavbarContent justify="end" className="flex-1">
        <NavbarItem>
          <span className="text-sm text-dark-text-secondary hidden sm:block">Web Anomaly Studio</span>
        </NavbarItem>

        <NavbarItem>
          <Button
            isIconOnly
            variant="light"
            className="text-dark-text-secondary hover:text-dark-text-primary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </Button>
        </NavbarItem>

        <NavbarItem>
          <Button
            isIconOnly
            variant="light"
            className="text-dark-text-secondary hover:text-dark-text-primary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </Button>
        </NavbarItem>

        <NavbarItem>
          <Badge content="1" color="danger" size="sm">
            <Button
              isIconOnly
              variant="light"
              className="text-dark-text-secondary hover:text-dark-text-primary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h8v-2H4v2zM4 11h10V9H4v2zM4 7h12V5H4v2z" />
              </svg>
            </Button>
          </Badge>
        </NavbarItem>

        <NavbarItem>
          <Button
            isIconOnly
            variant="light"
            className="text-dark-text-secondary hover:text-dark-text-primary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Button>
        </NavbarItem>

        <NavbarItem>
          <span className="text-sm text-dark-text-secondary hidden sm:block">EN</span>
        </NavbarItem>

        <NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              <Avatar
                size="sm"
                name="Andreas"
                className="bg-green-600 cursor-pointer"
              />
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="User menu"
              className="bg-dark-bg-secondary border border-dark-bg-tertiary"
            >
              <DropdownItem key="profile" className="text-dark-text-primary hover:bg-dark-bg-tertiary">
                Profile
              </DropdownItem>
              <DropdownItem key="settings" className="text-dark-text-primary hover:bg-dark-bg-tertiary">
                Settings
              </DropdownItem>
              <DropdownItem key="logout" className="text-danger" color="danger">
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>

        <NavbarItem>
          <Button
            isIconOnly
            variant="light"
            onPress={onToggleChat}
            className={`text-dark-text-secondary hover:text-dark-text-primary ${
              isChatOpen ? 'bg-blue-600 text-white' : ''
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

export default DarkHeader;
