import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface SystemInfo {
  status: string;
  timestamp: string;
  uptime: string;
  system: {
    platform: string;
    release: string;
    totalMemory: string;
    freeMemory: string;
    nodeVersion: string;
  };
}

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [toast, setToast] = useState<Toast | null>(null);

  // Helper to trigger temporary toasts
  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // 1. API - Fetch System Info / Health
  const fetchSystemInfo = async () => {
    try {
      // Use relative path due to Vite dev proxy, falls back nicely
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error('Failed to fetch health');
      const data: SystemInfo = await res.json();
      setSystemInfo(data);
      setIsConnected(true);
    } catch (err) {
      console.error('Error fetching system info:', err);
      setIsConnected(false);
      setSystemInfo(null);
    }
  };

  // 2. API - Fetch Tasks
  const fetchTasks = async () => {
    setIsLoadingTasks(true);
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data: Task[] = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      triggerToast('Could not load tasks. Is the backend API running?', 'error');
    } finally {
      setIsLoadingTasks(false);
    }
  };

  // 3. API - Add Task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle })
      });
      if (!res.ok) throw new Error('Failed to add task');
      const newTask: Task = await res.json();
      setTasks(prev => [...prev, newTask]);
      setNewTaskTitle('');
      triggerToast('Task added successfully!', 'success');
    } catch (err) {
      console.error('Error adding task:', err);
      triggerToast('Failed to add task.', 'error');
    }
  };

  // 4. API - Toggle Task Completed Status
  const handleToggleTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT'
      });
      if (!res.ok) throw new Error('Failed to update task');
      const updatedTask: Task = await res.json();
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
    } catch (err) {
      console.error('Error updating task:', err);
      triggerToast('Failed to update task status.', 'error');
    }
  };

  // 5. API - Delete Task
  const handleDeleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete task');
      setTasks(prev => prev.filter(t => t.id !== id));
      triggerToast('Task deleted successfully.', 'info');
    } catch (err) {
      console.error('Error deleting task:', err);
      triggerToast('Failed to delete task.', 'error');
    }
  };

  // Mount logic: fetch immediately and poll system info every 10s
  useEffect(() => {
    fetchSystemInfo();
    fetchTasks();

    const interval = setInterval(() => {
      fetchSystemInfo();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      {/* Header section */}
      <header>
        <div className="logo-section">
          <div className="logo-badge">ECS</div>
          <div className="app-title">
            <h1>App Cluster Service</h1>
            <p>React + Node.js Microservice Architecture</p>
          </div>
        </div>
        
        <div className="status-badge">
          <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
          <span>{isConnected ? 'API Connected' : 'API Offline'}</span>
        </div>
      </header>

      {/* Main Grid */}
      <main className="dashboard-grid">
        
        {/* Left Side: System Metrics panel */}
        <section className="glass-card">
          <div className="stats-header">
            {/* System Info Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="highlight-cyan"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
            <h2>System environment</h2>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Deploy Platform</span>
              <span className="stat-value">AWS Fargate ECS / Local Host</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Node Environment</span>
              <span className="stat-value highlight-cyan">
                {systemInfo ? systemInfo.system.platform : 'Unknown (Checking...)'}
              </span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Node.js Version</span>
              <span className="stat-value highlight-purple">
                {systemInfo ? systemInfo.system.nodeVersion : 'v--.--.--'}
              </span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Backend Uptime</span>
              <span className="stat-value">
                {systemInfo ? systemInfo.uptime : '0m 0s'}
              </span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Total System Memory</span>
              <span className="stat-value">
                {systemInfo ? systemInfo.system.totalMemory : '-- GB'}
              </span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Free System Memory</span>
              <span className="stat-value">
                {systemInfo ? systemInfo.system.freeMemory : '-- GB'}
              </span>
            </div>
          </div>
        </section>

        {/* Right Side: Task Manager CRUD panel */}
        <section className="glass-card">
          <div className="task-header">
            <h2>Deployment checklist</h2>
            <span className="task-count">
              {tasks.filter(t => t.completed).length} / {tasks.length} Completed
            </span>
          </div>

          {/* Form to add tasks */}
          <form onSubmit={handleAddTask} className="task-form">
            <input 
              type="text" 
              placeholder="Add next checklist action..." 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="task-input"
              disabled={!isConnected}
            />
            <button type="submit" className="btn" disabled={!isConnected}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Add Action
            </button>
          </form>

          {/* Tasks listing */}
          {isLoadingTasks ? (
            <div className="empty-state">
              <p>Fetching active deployment tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              {/* Empty state Clipboard SVG */}
              <svg className="empty-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
              <h3>No actions added yet</h3>
              <p>Type in the input field above and click Add Action to insert custom deployment steps.</p>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map(task => (
                <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <div className="task-item-content" onClick={() => handleToggleTask(task.id)}>
                    <div className="checkbox-custom">
                      {/* Checkmark SVG */}
                      <svg className="checkbox-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="task-title">{task.title}</span>
                  </div>
                  
                  <button 
                    onClick={() => handleDeleteTask(task.id)}
                    className="btn-delete"
                    title="Remove action"
                  >
                    {/* Trash Bin SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer>
        <p>ECS Cluster Demo | Powered by React Vite & Node Express</p>
      </footer>

      {/* Toast popup */}
      {toast && (
        <div className="toast">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="highlight-cyan"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default App;
