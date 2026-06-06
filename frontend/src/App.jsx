import { useState, useEffect } from 'react';

// STUDENT TODO: This API_URL works for local development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
fetch(`${API_URL}/api/todos`);

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  
  // State mới để quản lý cái Popup Sửa (Modal)
  const [isEditing, setIsEditing] = useState(false);
  const [currentEdit, setCurrentEdit] = useState({ id: null, title: '' });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/todos`);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      await fetch(`${API_URL}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo })
      });
      setNewTodo('');
      fetchTodos();
    } catch (err) {
      alert('Failed to add todo');
    }
  };

  const deleteTodo = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa công việc này?')) return;
    try {
      await fetch(`${API_URL}/api/todos/${id}`, {
        method: 'DELETE',
      });
      fetchTodos();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete todo');
    }
  };

  // Hàm Đổi trạng thái (Click vào icon)
  const toggleStatus = async (id, currentStatus) => {
    try {
      await fetch(`${API_URL}/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus })
      });
      fetchTodos();
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  // --- CÁC HÀM XỬ LÝ POPUP SỬA ---
  
  // 1. Mở popup và nạp dữ liệu cũ vào
  const openEditModal = (id, currentTitle) => {
    setCurrentEdit({ id, title: currentTitle });
    setIsEditing(true);
  };

  // 2. Lưu dữ liệu khi bấm Save trong Popup
  const saveEdit = async () => {
    if (!currentEdit.title.trim()) {
      setIsEditing(false); // Nếu nhập rỗng thì tự đóng luôn
      return;
    }
    try {
      await fetch(`${API_URL}/api/todos/${currentEdit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: currentEdit.title }) 
      });
      setIsEditing(false); // Đóng popup
      fetchTodos();        // Tải lại danh sách
    } catch (err) {
      console.error('Edit error:', err);
      alert('Failed to update todo');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
      <h1>🚀 DevOps Todo App</h1>
      <p>Demo: Watch UI update LIVE after CI/CD! ✨</p>

      <div style={{ marginBottom: '20px' }}>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo..."
          style={{ padding: '10px', width: '70%', marginRight: '10px' }}
        />
        <button onClick={addTodo} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Add Todo
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{
            padding: '10px',
            border: '1px solid #ddd',
            marginBottom: '5px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span 
              style={{ 
                flex: 1, 
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#888' : '#000'
              }}
            >
              {todo.title}
            </span>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span 
                onClick={() => toggleStatus(todo.id, todo.completed)}
                style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                title="Đổi trạng thái"
              >
                {todo.completed ? '✅' : '⏳'}
              </span>
              
              {/* Nút Sửa giờ sẽ gọi hàm mở Modal */}
              <button 
                onClick={() => openEditModal(todo.id, todo.title)}
                style={{ padding: '4px 8px', cursor: 'pointer' }}
              >
                Sửa
              </button>
              
              <button 
                onClick={() => deleteTodo(todo.id)}
                style={{ padding: '4px 8px', cursor: 'pointer', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '3px' }}
              >
                Xóa
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* --- GIAO DIỆN POPUP SỬA (MODAL) --- */}
      {isEditing && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền đen mờ
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000 // Đảm bảo luôn nằm trên cùng
        }}>
          <div style={{
            backgroundColor: 'white', padding: '20px', borderRadius: '8px',
            width: '300px', textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ marginTop: 0 }}>✏️ Edit Task</h3>
            <p style={{ fontSize: '14px', color: '#555' }}>Do you want to edit this task?</p>
            
            <input 
              value={currentEdit.title}
              onChange={(e) => setCurrentEdit({ ...currentEdit, title: e.target.value })}
              style={{ width: '90%', padding: '8px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '4px' }}
              autoFocus // Tự động focus con trỏ vào ô nhập
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <button 
                onClick={() => setIsEditing(false)} 
                style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                Cancel
              </button>
              <button 
                onClick={saveEdit} 
                style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '12px', color: '#666' }}>
        <p><strong>STUDENT TODO:</strong></p>
        <ul>
          <li>Dockerfile (multi-stage)</li>
          <li>Fix backend validation (broken test)</li>
          <li>CI/CD pipeline</li>
          <li>REPORT.md + Slides</li>
        </ul>
      </div>
    </div>
  );
}

export default App;