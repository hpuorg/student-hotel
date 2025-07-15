import React, { useState } from 'react';
import { Outlet } from '@modern-js/runtime/router';
import DarkSidebar from './DarkSidebar';
import DarkHeader from './DarkHeader';
import ChatInterface from './ChatInterface';

interface DarkThemeLayoutProps {
  children?: React.ReactNode;
}

export function DarkThemeLayout({ children }: DarkThemeLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="min-h-screen bg-dark-bg-primary text-dark-text-primary">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <DarkHeader 
          onToggleSidebar={toggleMobileSidebar}
          onToggleChat={toggleChat}
          isChatOpen={isChatOpen}
        />
      </div>

      <div className="flex pt-16">
        {/* Desktop Sidebar */}
        <div className={`hidden lg:block fixed left-0 top-16 bottom-0 z-30 transition-all duration-300 ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}>
          <DarkSidebar 
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={toggleSidebar}
          />
        </div>

        {/* Mobile Sidebar */}
        <div className={`lg:hidden fixed inset-0 z-50 ${isMobileSidebarOpen ? 'block' : 'hidden'}`}>
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="relative w-64 h-full">
            <DarkSidebar 
              isCollapsed={false}
              onToggleCollapse={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        } ${isChatOpen ? 'mr-96' : ''}`}>
          <main className="min-h-screen bg-dark-bg-primary">
            {children || <Outlet />}
          </main>
        </div>

        {/* Chat Interface */}
        <ChatInterface 
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      </div>
    </div>
  );
}

export default DarkThemeLayout;
