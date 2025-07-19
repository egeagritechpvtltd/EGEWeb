import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  PlusIcon, 
  UserCircleIcon, 
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminLayout() {
  const { signOut, currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out. Please try again.');
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Blog Posts', href: '/admin/posts', icon: DocumentTextIcon },
    { name: 'New Post', href: '/admin/posts/new', icon: PlusIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-indigo-600 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              type="button"
              className="text-white hover:text-indigo-50"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="flex items-center">
            <h1 className="text-lg font-medium text-white">Admin Panel</h1>
          </div>
          <div className="w-6"></div> {/* Spacer to balance the flex layout */}
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-indigo-700">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    'group flex items-center rounded-md px-2 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-75',
                    'hover:text-white'
                  )}
                >
                  <item.icon
                    className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-indigo-800 p-4">
            <div className="group block w-full flex-shrink-0">
              <div className="flex items-center">
                <div>
                  <UserCircleIcon className="h-10 w-10 text-indigo-200" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {currentUser?.displayName || 'Admin User'}
                  </p>
                  <button
                    onClick={handleSignOut}
                    className="text-xs font-medium text-indigo-200 group-hover:text-white"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-0 z-40 flex h-screen w-64 transform flex-col bg-indigo-700 transition duration-200 ease-in-out lg:hidden`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <h2 className="text-xl font-bold text-white">Menu</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white hover:text-indigo-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className="group flex items-center rounded-md px-2 py-2 text-base font-medium text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-75 hover:text-white"
            >
              <item.icon
                className="mr-4 h-6 w-6 flex-shrink-0 text-indigo-300"
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
          <button
            onClick={() => {
              handleSignOut();
              setSidebarOpen(false);
            }}
            className="group flex w-full items-center rounded-md px-2 py-2 text-base font-medium text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-75 hover:text-white"
          >
            <ArrowLeftOnRectangleIcon
              className="mr-4 h-6 w-6 flex-shrink-0 text-indigo-300"
              aria-hidden="true"
            />
            Sign Out
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:pl-64">
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
