"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function AdminPanel() {
  const router = useRouter();
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sprawdź czy admin key jest w localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('admin_key');
    if (savedKey) {
      setAdminKey(savedKey);
      verifyAndLoadData(savedKey);
    }
  }, []);

  const verifyAndLoadData = async (key) => {
    setLoading(true);
    setError(null);
    
    try {
      // Sprawdź czy klucz działa - pobierz statystyki
      const statsRes = await fetch(`${API_URL}/admin/stats?admin_key=${key}`);
      
      if (statsRes.status === 403) {
        setError("Invalid admin key");
        setIsAuthenticated(false);
        localStorage.removeItem('admin_key');
        return;
      }
      
      if (!statsRes.ok) {
        throw new Error("Failed to fetch stats");
      }
      
      const statsData = await statsRes.json();
      setStats(statsData);
      
      // Pobierz konwersacje
      const convRes = await fetch(`${API_URL}/admin/conversations?admin_key=${key}&limit=100`);
      const convData = await convRes.json();
      
      setConversations(convData.conversations || []);
      setIsAuthenticated(true);
      localStorage.setItem('admin_key', key);
      
    } catch (err) {
      console.error("Error loading admin data:", err);
      setError(err.message);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    verifyAndLoadData(adminKey);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminKey("");
    setConversations([]);
    setStats(null);
    setSelectedConversation(null);
    localStorage.removeItem('admin_key');
  };

  const exportToCSV = () => {
    if (conversations.length === 0) return;
    
    let csv = "Session ID,User ID,User Name,Value,Started,Messages Count,Status\n";
    
    conversations.forEach(conv => {
      csv += `"${conv.session_id}","${conv.user_id}","${conv.user_name}","${conv.chosen_value}","${conv.started_at}",${conv.message_count},"${conv.status}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Admin Panel
          </h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Key
              </label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter admin key"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Access Admin Panel"}
            </button>
          </form>
          
          <p className="mt-4 text-xs text-gray-500 text-center">
            For development: dev-admin-key-123
          </p>
        </div>
      </div>
    );
  }

  // Main admin panel
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Panel - Conversations
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => verifyAndLoadData(adminKey)}
                className="px-4 py-2 text-blue-600 hover:text-blue-800"
              >
                ↻ Refresh
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-500">Total Users</div>
              <div className="text-3xl font-bold text-gray-900">{stats.total_users}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-500">Total Sessions</div>
              <div className="text-3xl font-bold text-gray-900">{stats.total_sessions}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-500">Completed</div>
              <div className="text-3xl font-bold text-gray-900">{stats.completed_sessions}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-500">Last 7 Days</div>
              <div className="text-3xl font-bold text-gray-900">{stats.recent_sessions_7d}</div>
            </div>
          </div>
        )}

        {/* Export Button */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            📊 Export to CSV
          </button>
        </div>

        {/* Conversations List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Conversations ({conversations.length})
              </h2>
            </div>
            
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {conversations.map((conv) => (
                <div
                  key={conv.session_id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                    selectedConversation?.session_id === conv.session_id
                      ? 'bg-blue-50 border-l-4 border-blue-600'
                      : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {conv.user_name}
                        {conv.user_id.startsWith('guest-') && (
                          <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">Guest</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        Value: <span className="font-medium text-blue-600">{conv.chosen_value || 'Not chosen'}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {conv.message_count} msgs
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {new Date(conv.started_at).toLocaleString()}
                  </div>
                  
                  {conv.user_age && (
                    <div className="text-xs text-gray-500 mt-1">
                      Age: {conv.user_age}
                    </div>
                  )}
                </div>
              ))}
              
              {conversations.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No conversations yet
                </div>
              )}
            </div>
          </div>

          {/* Right: Conversation Detail */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Conversation Details
              </h2>
            </div>
            
            {selectedConversation ? (
              <div className="p-6 max-h-[600px] overflow-y-auto">
                {/* User Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">User Info</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Name:</strong> {selectedConversation.user_name}</div>
                    <div><strong>User ID:</strong> {selectedConversation.user_id}</div>
                    {selectedConversation.user_age && (
                      <div><strong>Age:</strong> {selectedConversation.user_age}</div>
                    )}
                    {selectedConversation.user_interests && selectedConversation.user_interests.length > 0 && (
                      <div><strong>Interests:</strong> {selectedConversation.user_interests.join(', ')}</div>
                    )}
                    <div><strong>Value:</strong> {selectedConversation.chosen_value}</div>
                    <div><strong>Status:</strong> {selectedConversation.status}</div>
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Messages ({selectedConversation.message_count})</h3>
                  
                  {selectedConversation.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-blue-50 border-l-4 border-blue-600'
                          : 'bg-gray-50 border-l-4 border-gray-400'
                      }`}
                    >
                      <div className="text-xs font-semibold text-gray-500 mb-1">
                        {msg.role === 'user' ? '👤 USER' : '🤖 AI'}
                        {msg.is_summary && ' (SUMMARY)'}
                      </div>
                      <div className="text-sm text-gray-800 whitespace-pre-wrap">
                        {msg.content}
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        {new Date(msg.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                {selectedConversation.summary && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-gray-900 mb-2">📄 Summary</h3>
                    <div className="text-sm text-gray-800 whitespace-pre-wrap">
                      {selectedConversation.summary}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                Select a conversation to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

