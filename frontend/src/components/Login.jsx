import { useState } from 'react';
import './Login.css';
import logo from './assets/logo.png';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    console.log('🔐 Attempting login:', { username, password });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log('📥 Server response:', data);

      if (res.ok && data.user) {
        onLogin(data.user);
      } else if (res.ok && data.username && data.role) {
        // fallback structure
        onLogin({ username: data.username, role: data.role });
      } else {
        console.warn('⚠️ Login failed with message:', data.error);
        setErrorMsg(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('❌ Login request failed:', err);
      setErrorMsg('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <img src={logo} alt="Logo" className="login-logo" />
        <h2>Welcome to Patient Tracking System</h2>
        {errorMsg && <p className="error">{errorMsg}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;
