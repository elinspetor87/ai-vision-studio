import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import IndexSimple from "./pages/IndexSimple";
import IndexDebug from "./pages/IndexDebug";
import IndexDebugV2 from "./pages/IndexDebugV2";
import IndexDebugV3 from "./pages/IndexDebugV3";
import TestMinimal from "./pages/TestMinimal";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLayout from "./components/admin/AdminLayout";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import BlogManagement from "./pages/admin/BlogManagement";
import BlogForm from "./pages/admin/BlogForm";
import FilmsManagement from "./pages/admin/FilmsManagement";
import FilmForm from "./pages/admin/FilmForm";
import VideosManagement from "./pages/admin/VideosManagement";
import Messages from "./pages/admin/Messages";
import Test from "./pages/admin/Test";
import LoginDebug from "./pages/admin/LoginDebug";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/test-minimal" element={<TestMinimal />} />
              <Route path="/test-simple" element={<IndexSimple />} />
              <Route path="/test-debug" element={<IndexDebug />} />
              <Route path="/test-debug-v2" element={<IndexDebugV2 />} />
              <Route path="/test-debug-v3" element={<IndexDebugV3 />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />

              {/* Admin routes */}
              <Route path="/admin/test" element={<Test />} />
              <Route path="/admin/debug" element={<LoginDebug />} />
              <Route path="/admin/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="blog" element={<BlogManagement />} />
                <Route path="blog/add" element={<BlogForm />} />
                <Route path="blog/edit/:id" element={<BlogForm />} />
                <Route path="films" element={<FilmsManagement />} />
                <Route path="films/add" element={<FilmForm />} />
                <Route path="films/edit/:id" element={<FilmForm />} />
                <Route path="videos" element={<VideosManagement />} />
                <Route path="messages" element={<Messages />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
