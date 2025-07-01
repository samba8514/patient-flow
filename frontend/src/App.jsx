import { useState, useEffect } from 'react';
import Login from './components/Login';
import AdminDashboard from './pages/AdminDashboard';
import PatientTaskTracker from './pages/PatientTaskTracker'; // ✅ Import the board UI page

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogin = (user) => {
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
