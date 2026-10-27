import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import { PageSkeleton } from "@/components/shared/Skeleton";

// Pages load on demand. During a member's install, a page whose part hasn't been copied yet shows a short
// "still installing" note instead of breaking the app, so the home screen works after the first message.
const PAGES = import.meta.glob('./pages/*.jsx');
const StillInstalling = () => (
  <div className="max-w-xl mx-auto py-24 px-6 text-center">
    <h1 className="text-2xl font-semibold">This tool is still installing</h1>
    <p className="mt-3 text-app-muted">Send the next install message in Base44. It appears here when its part is done.</p>
  </div>
);
const page = (name) => (PAGES[`./pages/${name}.jsx`] ? lazy(PAGES[`./pages/${name}.jsx`]) : StillInstalling);
const Login = page('Login');
const Register = page('Register');
const ForgotPassword = page('ForgotPassword');
const ResetPassword = page('ResetPassword');
const Home = page('Home');
const Search = page('Search');
const Settings = page('Settings');
const SetupCheck = page('SetupCheck');

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <PageSkeleton />
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Suspense fallback={<div className="fixed inset-0 flex items-center justify-center"><PageSkeleton /></div>}>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search/:id" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/setup-check" element={<SetupCheck />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </Suspense>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App