import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Dashboard from './NewDashboard';
import BlogPostList from '../../components/blog/BlogPostList';
import BlogPostForm from '../../components/blog/BlogPostForm';
import EditBlogPost from './EditBlogPost';
import Categories from './Categories';

// Admin layout component that wraps all admin routes
function AdminLayout() {
  const { currentUser, isAdmin, signOut } = useAuth();

  if (!currentUser || !isAdmin) {
    return <Navigate to="/login" state={{ from: '/admin' }} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-full">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          {/* Top navigation */}
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {currentUser.email}
                </span>
                <button
                  onClick={signOut}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Sign out
                </button>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="posts" element={<BlogPostList />} />
        <Route path="posts/new" element={<BlogPostForm />} />
        <Route path="posts/:id" element={<EditBlogPost />} />
        <Route path="categories" element={<Categories />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
