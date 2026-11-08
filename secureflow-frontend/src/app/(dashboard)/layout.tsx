'use client';

import { useState } from 'react';
import { Sidebar, TopNav } from '@/components/layout';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  return (
    <div className="min-h-screen bg-canvas flex">
      <Sidebar
        isOpen={isMobile ? mobileSidebarOpen : sidebarOpen}
        onToggle={isMobile ? () => setMobileSidebarOpen(false) : handleSidebarToggle}
        user={user ? { name: user.name, email: user.email, avatar: user.avatarUrl, role: 'owner' } : undefined}
      />
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        <TopNav
          onMenuClick={handleMenuClick}
          user={user ? { name: user.name, email: user.email, avatar: user.avatarUrl, role: 'owner' } : undefined}
          onLogout={() => useAuthStore.getState().logout()}
        />
        <main className="flex-1 pt-16 lg:pt-16 px-4 lg:px-6 pb-8 overflow-x-hidden">
          <div className="max-w-full mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}