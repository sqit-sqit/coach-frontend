"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Target, MessageSquare, User, LogOut, Clock, CheckCircle, TrendingUp, Trash2 } from "lucide-react";
import { useAuth } from "hooks/useAuth";
import DeleteAccountModal from "components/DeleteAccountModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, userId, token } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  // Fetch dashboard data
  useEffect(() => {
    if (!userId || !isAuthenticated) {
      setLoadingData(false);
      return;
    }
    
    async function fetchDashboard() {
      try {
        const res = await fetch(`${API_URL}/values/user/${userId}/dashboard`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log('Dashboard data:', data); // Debug
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        // Set empty dashboard data on error
        setDashboardData({
          user_id: userId,
          total_sessions: 0,
          completed_sessions: 0,
          sessions: []
        });
      } finally {
        setLoadingData(false);
      }
    }
    
    fetchDashboard();
  }, [userId, isAuthenticated]);

  // Show loading
  if (isLoading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect
  }

  const handleLogout = () => {
    logout();
    // Hard redirect to ensure fresh state
    window.location.href = '/';
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_URL}/auth/delete-account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      // Clear all local data
      localStorage.clear();
      
      // Redirect to home
      alert('Your account has been successfully deleted. We\'re sorry to see you go!');
      router.push('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('An error occurred while deleting your account. Please try again or contact support.');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      {/* Header with user info */}
      <div className="flex justify-between items-center mb-8 pb-6 border-b-2 border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name || 'Friend'}!</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      {dashboardData && dashboardData.total_sessions > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Total Sessions</h3>
            </div>
            <div className="text-3xl font-bold text-blue-600">{dashboardData.total_sessions}</div>
          </div>
          
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-gray-900">Completed</h3>
            </div>
            <div className="text-3xl font-bold text-green-600">{dashboardData.completed_sessions}</div>
          </div>
          
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-gray-900">In Progress</h3>
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {dashboardData.total_sessions - dashboardData.completed_sessions}
            </div>
          </div>
        </div>
      )}

      {/* Session History */}
      {dashboardData && dashboardData.sessions && dashboardData.sessions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Your Value Workshops</h2>
          <div className="space-y-4">
            {dashboardData.sessions.map((session) => (
              <div
                key={session.session_id}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Star className="w-5 h-5" style={{ color: "var(--Secondary-5-main)" }} />
                      <h3 className="text-xl font-bold text-gray-900">
                        {session.chosen_value || 'Value not chosen yet'}
                      </h3>
                      {session.status === 'completed' && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Completed
                        </span>
                      )}
                      {session.status === 'in_progress' && (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                          In Progress
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Started: {new Date(session.started_at).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</div>
                      <div>{session.message_count} messages exchanged</div>
                      {session.has_summary && (
                        <div className="text-green-600 font-medium">✓ Summary generated</div>
                      )}
                    </div>
                  </div>
                  
                  {session.status === 'in_progress' && (
                    <Link
                      href="/values/chat"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
                    >
                      Continue →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {dashboardData && dashboardData.total_sessions === 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-8 mb-8 text-center">
          <Star className="w-16 h-16 mx-auto mb-4 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your Journey!</h2>
          <p className="text-gray-600 mb-6">
            You haven't started any workshops yet. Choose a tool below to begin your personal growth journey.
          </p>
        </div>
      )}

      {/* Mini Apps Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          {dashboardData && dashboardData.total_sessions > 0 ? 'Start New Workshop' : 'Your Coaching Tools'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 🔹 Warsztat wartości */}
        <Link href="/values/init">
          <div
            className="p-6 rounded-lg text-center hover:shadow-lg transition cursor-pointer"
            style={{
              background: "var(--Primary-1)",
              border: "2px solid var(--Primary-7-main)",
            }}
          >
            <Star
              className="w-10 h-10 mx-auto mb-4"
              style={{ color: "var(--Secondary-5-main)" }}
            />
            <h2 className="text-xl font-semibold mb-2">Value Workshop</h2>
            <p className="text-gray-600">
              Recognize your life values.
            </p>
          </div>
        </Link>

        {/* 🔹 Model GROW */}
        <div
          className="p-6 rounded-lg text-center hover:shadow-lg transition"
          style={{
            background: "var(--Primary-1)",
            border: "2px solid var(--Primary-7-main)",
          }}
        >
          <Target
            className="w-10 h-10 mx-auto mb-4"
            style={{ color: "var(--Secondary-5-main)" }}
          />
          <h2 className="text-xl font-semibold mb-2">Model GROW</h2>
          <p className="text-gray-600">
            Zdefiniuj cele i zaplanuj kroki działania.
          </p>
        </div>

        {/* 🔹 Chat */}
        <Link href="/chat">
          <div
            className="p-6 rounded-lg text-center hover:shadow-lg transition cursor-pointer"
            style={{
              background: "var(--Primary-1)",
              border: "2px solid var(--Primary-7-main)",
            }}
          >
            <MessageSquare
              className="w-10 h-10 mx-auto mb-4"
              style={{ color: "var(--Secondary-5-main)" }}
            />
            <h2 className="text-xl font-semibold mb-2">Chat</h2>
            <p className="text-gray-600">
              Rozmawiaj z AI w nowej mini-aplikacji.
            </p>
          </div>
        </Link>
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="mt-12 pt-8 border-t-2 border-gray-200">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Danger Zone</h3>
          <p className="text-sm text-gray-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border-2 border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition font-semibold"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        isDeleting={isDeleting}
      />
    </section>
  );
}
