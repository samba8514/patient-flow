import { useEffect, useState } from 'react';

function TaskList({ user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks?username=${user.username}`);
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  if (loading) return <p>Loading tasks...</p>;

  if (tasks.length === 0) return <p>No tasks found for user {user.username}</p>;

  return (
    <div>
      <h2>Tasks for {user.username}</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.patient_name} — {task.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
