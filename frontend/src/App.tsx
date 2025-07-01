import { useEffect, useState } from 'react';
import Login from './components/Login';
import AdminDashboard from './AdminDashboard';
import PatientTaskTracker from './components/PatientTaskTracker'; // ✅ your modern board

function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogin = (user: any) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="App">
      <h1>Patient Task Tracker</h1>
      {user ? (
        <>
          <button onClick={handleLogout} style={{ float: 'right' }}>Logout</button>
          {user.role === 'admin' ? (
            <AdminDashboard onLogout={handleLogout} />
          ) : (
            <PatientTaskTracker user={user} onLogout={handleLogout} />
          )}
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
