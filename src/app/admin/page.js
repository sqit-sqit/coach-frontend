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
  
  // AI Models state
  const [aiModels, setAiModels] = useState({ configs: {}, available_models: [] });
  const [editingModel, setEditingModel] = useState(null);
  
  // Users state
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);

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
      
      // Pobierz konfigurację AI models
      const aiModelsRes = await fetch(`${API_URL}/admin/ai-models?admin_key=${key}`);
      if (aiModelsRes.ok) {
        const aiModelsData = await aiModelsRes.json();
        setAiModels(aiModelsData);
      }
      
      // Pobierz użytkowników
      await fetchUsers(key);
      
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
    setUsers([]);
    setShowUsers(false);
    localStorage.removeItem('admin_key');
  };

  const fetchUsers = async (key) => {
    try {
      const response = await fetch(`${API_URL}/admin/users?admin_key=${key}&limit=200`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const exportUsersToCSV = () => {
    if (users.length === 0) return;
    
    const headers = ['Email', 'Name', 'Created At', 'Last Activity', 'Total Sessions', 'Recent Sessions (30d)', 'Status'];
    const csvContent = [
      headers.join(','),
      ...users.map(user => [
        user.email,
        user.name || '',
        user.created_at || '',
        user.last_activity || '',
        user.total_sessions || 0,
        user.recent_sessions_30d || 0,
        user.is_active ? 'Active' : 'Inactive'
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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

  const updateAIModel = async (appName, config) => {
    try {
      const res = await fetch(`${API_URL}/admin/ai-models/${appName}?admin_key=${adminKey}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to update AI model');
      }
      
      const data = await res.json();
      alert(`✅ AI model updated for ${appName}!`);
      
      // Refresh AI models data
      const aiModelsRes = await fetch(`${API_URL}/admin/ai-models?admin_key=${adminKey}`);
      if (aiModelsRes.ok) {
        const aiModelsData = await aiModelsRes.json();
        setAiModels(aiModelsData);
      }
      
      setEditingModel(null);
    } catch (err) {
      console.error('Error updating AI model:', err);
      alert(`❌ Failed to update AI model: ${err.message}`);
    }
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
              Admin Panel
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
        {/* Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setShowUsers(false)}
            className={`px-4 py-2 rounded ${!showUsers ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Conversations
          </button>
          <button
            onClick={() => setShowUsers(true)}
            className={`px-4 py-2 rounded ${showUsers ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Users
          </button>
        </div>

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

        {/* AI Model Configuration */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span>🤖</span> AI Model Configuration
          </h2>
          
          <div className="space-y-4">
            {Object.entries(aiModels.configs || {}).map(([appName, config]) => (
              <div key={appName} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg capitalize">{appName}</h3>
                    <p className="text-sm text-gray-600">{config.description}</p>
                  </div>
                  {editingModel?.app === appName ? (
                    <button
                      onClick={() => setEditingModel(null)}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingModel({ app: appName, ...config })}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  )}
                </div>
                
                {editingModel?.app === appName ? (
                  <div className="space-y-3 mt-3 border-t pt-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">AI Model</label>
                      <select
                        value={editingModel.model}
                        onChange={(e) => setEditingModel({...editingModel, model: e.target.value})}
                        className="w-full px-3 py-2 border rounded bg-white"
                      >
                        {aiModels.available_models?.map(model => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        💡 Recommended: gpt-4o-mini (best quality/price ratio)
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Temperature: {editingModel.temperature?.toFixed(1)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={editingModel.temperature}
                        onChange={(e) => setEditingModel({...editingModel, temperature: parseFloat(e.target.value)})}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>More focused (0)</span>
                        <span>More creative (1)</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => updateAIModel(appName, {
                        model: editingModel.model,
                        temperature: editingModel.temperature,
                        max_tokens: editingModel.max_tokens
                      })}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium"
                    >
                      💾 Save Changes
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Model:</span>
                      <span className="ml-2 font-mono font-medium">{config.model}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Temperature:</span>
                      <span className="ml-2 font-medium">{config.temperature}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
            <p className="font-medium mb-1">📖 Available Models:</p>
            <ul className="text-xs space-y-1 text-gray-700">
              <li><strong>gpt-4o-mini:</strong> Best balance (recommended) 💰</li>
              <li><strong>gpt-4o:</strong> Highest quality, premium price 💎</li>
              <li><strong>gpt-4-turbo:</strong> Previous gen, still powerful 🚀</li>
              <li><strong>gpt-3.5-turbo:</strong> Budget friendly, fast ⚡</li>
            </ul>
          </div>
        </div>

        {/* Users Section */}
        {showUsers && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Registered Users ({users.length})</h2>
              <button
                onClick={exportUsersToCSV}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Export CSV
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Created</th>
                    <th className="px-4 py-2 text-left">Last Activity</th>
                    <th className="px-4 py-2 text-left">Sessions</th>
                    <th className="px-4 py-2 text-left">Recent (30d)</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.user_id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.name || 'N/A'}</td>
                      <td className="px-4 py-2">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-2">
                        {user.last_activity ? new Date(user.last_activity).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-4 py-2">{user.total_sessions}</td>
                      <td className="px-4 py-2">{user.recent_sessions_30d}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {users.length === 0 && (
              <p className="text-gray-500 text-center py-4">No users found</p>
            )}
          </div>
        )}

        {/* Export Button */}
        {!showUsers && (
          <div className="mb-4 flex justify-end">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              📊 Export to CSV
            </button>
          </div>
        )}

        {/* Conversations List */}
        {!showUsers && (
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
        )}
      </div>
    </div>
  );
}

