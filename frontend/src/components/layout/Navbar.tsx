import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Menu, User, Heart, Bell, Settings, Home } from 'lucide-react';

// Simple utility for conditional class names
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Simple dropdown component
const DropdownMenu = ({ trigger, children }: { trigger: React.ReactNode; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const DropdownMenuItem = ({ 
  children, 
  onClick,
  className = ''
}: { 
  children: React.ReactNode; 
  onClick?: () => void;
  className?: string;
}) => (
  <div 
    className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

const DropdownMenuLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
    {children}
  </div>
);

const DropdownMenuSeparator = () => (
  <div className="border-t border-gray-100 my-1"></div>
);

const Avatar = ({ 
  src, 
  alt, 
  fallback,
  className = ''
}: { 
  src?: string; 
  alt?: string; 
  fallback: string;
  className?: string;
}) => (
  <div className={`relative h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center ${className}`}>
    {src ? (
      <img 
        src={src} 
        alt={alt} 
        className="h-full w-full rounded-full object-cover"
      />
    ) : (
      <span className="text-sm font-medium text-gray-600">
        {fallback.substring(0, 2).toUpperCase()}
      </span>
    )}
  </div>
);

const Navbar: React.FC = () => {
  const { user, logout } = useAuth() as { user: { name?: string; email?: string; role?: string; avatar?: string } | null; logout: () => Promise<void> };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/', requiresAuth: false },
    { name: 'How It Works', href: '/how-it-works', requiresAuth: false },
    { name: 'Find Donors', href: '/matching', requiresAuth: true, role: 'recipient' },
    { name: 'Donate Now', href: '/donate', requiresAuth: true, role: 'donor' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-red-600" />
            <span className="font-bold text-xl">Connect2Life</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => {
              if (link.requiresAuth && !user) return null;
              if (link.role && user?.role !== link.role) return null;
              
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-5 w-5" />
              </button>
              <DropdownMenu
                trigger={
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <Avatar 
                      src={user.avatar} 
                      alt={user.name} 
                      fallback={user.name || 'U'} 
                      className="h-8 w-8"
                    />
                    <span className="hidden md:inline-block text-sm font-medium">
                      {user.name || 'User'}
                    </span>
                  </button>
                }
              >
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {user.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Sign up
              </Link>
            </>
          )}
          
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={cn(
        'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
        isMobileMenuOpen ? 'max-h-60 py-2' : 'max-h-0 py-0'
      )}>
        <div className="container flex flex-col space-y-2 px-4">
          {navLinks.map((link) => {
            if (link.requiresAuth && !user) return null;
            if (link.role && user?.role !== link.role) return null;
            
            return (
              <Link
                key={link.href}
                to={link.href}
                className="block py-2 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
