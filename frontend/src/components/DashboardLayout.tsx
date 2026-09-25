import React from 'react';
import DashboardNavbar from './DashboardNavbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;