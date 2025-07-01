import { useState } from 'react';

function AdminDashboard() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('staff');
  const [status, setStatus] = useState('');

  const handleCreateUser = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        new_username: username,
        new_password: password,
        role,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setStatus('✅ User created');
      setUsername('');
      setPassword('');
    } else {
      setStatus(`❌ ${data.error}`);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div>
        <h3>Create New User</h3>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={handleCreateUser}>Create User</button>
        <p>{status}</p>
      </div>
      <pre>
        <strong>Terminal Logs:</strong>
        {'\n'}(Placeholder logs here. We’ll improve this later.)
      </pre>
    </div>
  );
}

export default AdminDashboard;
