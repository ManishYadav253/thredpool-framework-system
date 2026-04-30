import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Server, Users, Zap, Power, RotateCcw, List, BarChart2, Settings, LogIn, UserPlus, Info, Phone, Skull, XCircle } from 'lucide-react';

import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import AboutUs from './pages/AboutUs.jsx';
import ContactUs from './pages/ContactUs.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
console.log('Using API_URL:', API_URL);

function ThreadStatusBar({ status }) {
  const total = Math.max(status.totalWorkers + status.deadThreads, 1);
  const activePercent = (status.activeThreads / total) * 100;
  const idlePercent = (status.idleThreads / total) * 100;
  const deadPercent = (status.deadThreads / total) * 100;

  return (
    <div className="mt-4 bg-slate-900/50 border border-slate-800 p-4 rounded-2xl shadow-lg">
      <div className="flex justify-between text-xs text-slate-400 mb-3 font-medium uppercase tracking-wider">
        <span className="flex items-center gap-2"><Activity className="w-3 h-3 text-blue-400" /> Pool Health & Vitality</span>
        <span className="flex gap-4">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> {status.activeThreads} Active</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-600"></div> {status.idleThreads} Idle</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> {status.deadThreads} Dead</span>
        </span>
      </div>
      <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner border border-slate-700/50">
        <div style={{ width: `${activePercent}%` }} className="bg-emerald-500 h-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
        <div style={{ width: `${idlePercent}%` }} className="bg-slate-600 h-full transition-all duration-500"></div>
        <div style={{ width: `${deadPercent}%` }} className="bg-red-500 h-full transition-all duration-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]"></div>
      </div>
    </div>
  );
}

function Navbar({ isAuthenticated, onLogout }) {
  return (
    <header className="max-w-6xl mx-auto mb-8 flex flex-wrap justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-xl gap-4">
      <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
        <div className="p-3 bg-blue-500/20 rounded-xl">
          <Server className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Thread Pool OS Simulator
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">High-performance concurrency visualizer</p>
        </div>
      </Link>

      <div className="flex flex-wrap gap-2 items-center">
        {/* Ordered Navigation Bar */}
        {/* 1. About Us */}
        <Link to="/about" className="px-3 py-1.5 rounded-lg font-medium text-sm bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 transition-colors">
          <Info className="w-3.5 h-3.5 text-cyan-400" /> About Us
        </Link>

        {/* 2. Login/Logout */}
        {isAuthenticated ? (
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg font-bold text-sm bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30 flex items-center gap-1.5 transition-all"
          >
            <Power className="w-3.5 h-3.5" /> Logout
          </button>
        ) : (
          <Link to="/login" className="px-3 py-1.5 rounded-lg font-medium text-sm bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 transition-colors">
            <LogIn className="w-3.5 h-3.5 text-blue-400" /> Login
          </Link>
        )}

        {/* 3. Dashboard (Home) */}
        <Link to="/" className="px-3 py-1.5 rounded-lg font-medium text-sm bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-colors">
          Dashboard
        </Link>

        {/* 4. Contact Us */}
        <Link to="/contact" className="px-3 py-1.5 rounded-lg font-medium text-sm bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 transition-colors">
          <Phone className="w-3.5 h-3.5 text-emerald-400" /> Contact Us
        </Link>
      </div>
    </header>
  );
}

function Dashboard() {
  const [status, setStatus] = useState({ totalWorkers: 0, activeThreads: 0, idleThreads: 0, deadThreads: 0, deadTasks: 0, queueSize: 0, completedTasks: 0, logs: [] });
  const [history, setHistory] = useState([]);
  const [compareResult, setCompareResult] = useState(null);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [poolSize, setPoolSize] = useState(4);
  const [taskParams, setTaskParams] = useState({ type: 'cpu', param: 100, priority: 1, count: 1 });
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`${API_URL}/status`);
        setStatus(res.data);
        setHistory(prev => {
          const now = new Date();
          const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
          const newHist = [...prev, { time: timeStr, completed: res.data.completedTasks, queue: res.data.queueSize, active: res.data.activeThreads, dead: res.data.deadThreads }];
          if (newHist.length > 20) return newHist.slice(newHist.length - 20);
          return newHist;
        });
      } catch (err) {
        // Handle silently
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const submitTask = async () => {
    try {
      for (let i = 0; i < taskParams.count; i++) {
        await axios.post(`${API_URL}/task`, { ...taskParams, priority: parseInt(taskParams.priority) });
      }
    } catch (err) { console.error(err); }
  };

  const resizePool = async () => {
    try {
      await axios.post(`${API_URL}/resize`, { size: parseInt(poolSize) });
    } catch (err) { alert("Invalid size"); }
  };

  const shutdownPool = async () => {
    await axios.post(`${API_URL}/shutdown`);
  };

  const restartPool = async () => {
    await axios.post(`${API_URL}/restart`, { size: parseInt(poolSize) });
  };

  const runComparison = async () => {
    setLoadingCompare(true);
    try {
      const res = await axios.post(`${API_URL}/compare`, { taskCount: 20, type: 'cpu', param: 200 });
      setCompareResult(res.data);
    } catch (err) { console.error(err); }
    setLoadingCompare(false);
  };

  const exportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(status.logs, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", "threadpool_logs.json");
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Dashboard Sub-Header (Tabs only) */}
      <div className="mb-8 flex flex-wrap justify-center items-center bg-slate-900/30 p-2 rounded-xl border border-slate-800/50 gap-2">
        <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700'}`}>Dashboard View</button>
        <button onClick={() => setActiveTab('history')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700'}`}>History & Logs</button>
        <button onClick={() => setActiveTab('compare')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-1.5 ${activeTab === 'compare' ? 'bg-purple-600 text-white' : 'bg-slate-800 hover:bg-slate-700'}`}>
          <Zap className="w-3.5 h-3.5" /> Performance Benchmark
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Column */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
                <div className="flex items-center gap-2 text-slate-400 mb-2"><Users className="w-4 h-4" /> Total Workers</div>
                <div className="text-4xl font-bold text-white">{status.totalWorkers}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
                <div className="flex items-center gap-2 text-slate-400 mb-2"><Activity className="w-4 h-4 text-emerald-400" /> Active</div>
                <div className="text-4xl font-bold text-emerald-400">{status.activeThreads}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
                <div className="flex items-center gap-2 text-slate-400 mb-2"><List className="w-4 h-4 text-amber-400" /> Queue Size</div>
                <div className="text-4xl font-bold text-amber-400">{status.queueSize}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
                <div className="flex items-center gap-2 text-slate-400 mb-2"><BarChart2 className="w-4 h-4 text-blue-400" /> Completed</div>
                <div className="text-4xl font-bold text-blue-400">{status.completedTasks}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
                <div className="flex items-center gap-2 text-slate-400 mb-2"><Skull className="w-4 h-4 text-red-500" /> Dead Threads</div>
                <div className="text-4xl font-bold text-red-500">{status.deadThreads}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
                <div className="flex items-center gap-2 text-slate-400 mb-2"><XCircle className="w-4 h-4 text-orange-500" /> Dead Tasks</div>
                <div className="text-4xl font-bold text-orange-500">{status.deadTasks}</div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-slate-800 pb-2"><Settings className="w-5 h-5" /> Pool Controls</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Target Pool Size (1-20)</label>
                  <div className="flex gap-2">
                    <input type="number" min="1" max="20" value={poolSize} onChange={e => setPoolSize(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                    <button onClick={resizePool} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg font-medium transition-colors">Resize</button>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={restartPool} className="flex-1 flex justify-center items-center gap-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 py-2 rounded-lg font-medium transition-colors border border-emerald-500/30">
                    <RotateCcw className="w-4 h-4" /> Restart
                  </button>
                  <button onClick={shutdownPool} className="flex-1 flex justify-center items-center gap-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 py-2 rounded-lg font-medium transition-colors border border-red-500/30">
                    <Power className="w-4 h-4" /> Shutdown
                  </button>
                </div>
              </div>
            </div>

            {/* Task Submission */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-slate-800 pb-2"><Zap className="w-5 h-5" /> Submit Tasks</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Type</label>
                    <select value={taskParams.type} onChange={e => setTaskParams({ ...taskParams, type: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500">
                      <option value="cpu">CPU Bound (Math)</option>
                      <option value="io">I/O Bound (Delay)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Weight/Delay</label>
                    <input type="number" value={taskParams.param} onChange={e => setTaskParams({ ...taskParams, param: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Priority</label>
                    <select value={taskParams.priority} onChange={e => setTaskParams({ ...taskParams, priority: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500">
                      <option value="0">High (0)</option>
                      <option value="1">Medium (1)</option>
                      <option value="2">Low (2)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Count</label>
                    <input type="number" min="1" max="100" value={taskParams.count} onChange={e => setTaskParams({ ...taskParams, count: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <button onClick={submitTask} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all">
                  Submit Tasks to Pool
                </button>
              </div>
            </div>
            
            <ThreadStatusBar status={status} />
          </div>

          {/* Visualization Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg h-[400px] flex flex-col">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-slate-800 pb-2"><Activity className="w-5 h-5" /> Live System Telemetry</h2>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorQueue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorDead" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                    <Legend />
                    <Area type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorActive)" name="Active Threads" />
                    <Area type="monotone" dataKey="queue" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorQueue)" name="Queue Size" />
                    <Area type="monotone" dataKey="dead" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorDead)" name="Dead Threads" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#0c111c] border border-slate-800 p-4 rounded-2xl shadow-lg h-[350px] flex flex-col font-mono text-sm">
              <div className="flex justify-between items-center mb-3 border-b border-slate-800 pb-2">
                <span className="text-slate-400 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>System Logs
                </span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1">
                {status.logs.map(log => (
                  <div key={log.id} className="text-slate-300">
                    <span className="text-slate-500">[{log.time}]</span>{' '}
                    <span className={log.message.includes('completed') ? 'text-emerald-400' : log.message.includes('started') ? 'text-blue-400' : 'text-slate-300'}>{log.message}</span>
                  </div>
                ))}
                {status.logs.length === 0 && <div className="text-slate-600 italic">Waiting for system events...</div>}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Benchmark Tab */}
      {activeTab === 'compare' && (
        <main className="max-w-4xl mx-auto mt-10">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Thread Pool vs Thread-Per-Task</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">See the overhead of creating and destroying threads versus reusing them via our Thread Pool Framework.</p>
              <button
                onClick={runComparison}
                disabled={loadingCompare}
                className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 mx-auto"
              >
                {loadingCompare ? <RotateCcw className="animate-spin" /> : <Zap />}
                {loadingCompare ? 'Running Benchmark...' : 'Start Benchmark (20 Heavy Tasks)'}
              </button>
            </div>
            {compareResult && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-slate-950 border border-red-900/30 p-6 rounded-2xl text-center">
                  <div className="text-red-400 text-sm font-bold uppercase tracking-wider mb-2">Without Pool (Thread-Per-Task)</div>
                  <div className="text-4xl font-bold text-white mb-1">{compareResult.noPoolTimeMs} <span className="text-xl text-slate-500">ms</span></div>
                  <div className="text-slate-500 text-sm">Created &amp; destroyed 20 threads</div>
                </div>
                <div className="bg-slate-950 border border-emerald-900/30 p-6 rounded-2xl text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-500/5"></div>
                  <div className="relative z-10">
                    <div className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-2">With Thread Pool</div>
                    <div className="text-4xl font-bold text-white mb-1">{compareResult.poolTimeMs} <span className="text-xl text-slate-500">ms</span></div>
                    <div className="text-emerald-500 text-sm font-bold mt-2 bg-emerald-500/10 inline-block px-3 py-1 rounded-full">{compareResult.speedup}x Faster!</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <main className="max-w-5xl mx-auto mt-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-white"><List className="w-6 h-6 text-blue-400" /> System Logs &amp; Task History</h2>
              <button onClick={exportLogs} className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 text-white shadow-lg transition-all">
                Export Logs to JSON
              </button>
            </div>
            <div className="overflow-hidden border border-slate-800 rounded-xl">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-950 text-slate-300 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4">Event ID</th>
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">Status Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {status.logs.map((log) => (
                    <tr key={log.id} className="bg-slate-900 hover:bg-slate-800/80 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{log.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{log.time}</td>
                      <td className={`px-6 py-4 font-mono ${log.message.includes('completed') ? 'text-emerald-400' : log.message.includes('started') ? 'text-blue-400' : 'text-slate-300'}`}>
                        {log.message}
                      </td>
                    </tr>
                  ))}
                  {status.logs.length === 0 && (
                    <tr><td colSpan="3" className="px-6 py-10 text-center text-slate-500 italic">No events recorded yet. Start submitting tasks!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-sans">
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </div>
  );
}

export default App;
