import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './config/fontAwesome';
import './App.css';

// Componente AddTodo
const AddTodo = ({ onAddTodo }) => {
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [priority, setPriority] = useState('medium');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const calculateDuration = (start, end) => {
    if (!start || !end) return 0;
    
    const [startHours, startMinutes] = start.split(':').map(Number);
    const [endHours, endMinutes] = end.split(':').map(Number);
    
    const startTotal = startHours * 60 + startMinutes;
    const endTotal = endHours * 60 + endMinutes;
    
    return endTotal - startTotal;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      const duration = calculateDuration(startTime, endTime);
      
      onAddTodo({
        id: Date.now(),
        text: text.trim(),
        description: description.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        startTime,
        endTime,
        duration,
        priority
      });

      setText('');
      setDescription('');
      setStartTime('');
      setEndTime('');
      setPriority('medium');
      setShowAdvanced(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-todo-form">
      <div className="basic-fields">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="O que você precisa fazer hoje?"
          className="todo-input"
          required
        />
        <button type="submit" className="add-button">
          <FontAwesomeIcon icon="plus" />
          Adicionar
        </button>
      </div>

      <button
        type="button"
        className="advanced-toggle"
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        <FontAwesomeIcon icon={showAdvanced ? "chevron-up" : "chevron-down"} />
        {showAdvanced ? 'Ocultar Opções' : 'Mais Opções'}
      </button>

      {showAdvanced && (
        <div className="advanced-fields">
          <div className="form-group full-width">
            <label className="form-label">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes da tarefa..."
              className="form-textarea"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <FontAwesomeIcon icon="clock" />
                Horário de Início
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <FontAwesomeIcon icon="clock" />
                Horário de Término
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label className="form-label">Prioridade</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="form-select"
            >
              <option value="low">
                <FontAwesomeIcon icon="circle" style={{color: '#10b981'}} />
                Baixa
              </option>
              <option value="medium">
                <FontAwesomeIcon icon="circle" style={{color: '#f59e0b'}} />
                Média
              </option>
              <option value="high">
                <FontAwesomeIcon icon="circle-exclamation" style={{color: '#ef4444'}} />
                Alta
              </option>
            </select>
          </div>
        </div>
      )}
    </form>
  );
};

// Componente TodoItem
const TodoItem = ({ todo, onToggle, onDelete }) => {
  const formatTime = (time) => {
    if (!time) return '';
    return time.substring(0, 5);
  };

  const formatDuration = (minutes) => {
    if (!minutes || minutes <= 0) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <FontAwesomeIcon icon="circle-exclamation" style={{color: '#ef4444'}} />;
      case 'medium':
        return <FontAwesomeIcon icon="circle" style={{color: '#f59e0b'}} />;
      case 'low':
        return <FontAwesomeIcon icon="circle" style={{color: '#10b981'}} />;
      default:
        return <FontAwesomeIcon icon="circle" style={{color: '#6b7280'}} />;
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Normal';
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-header">
        <div className="todo-main">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="todo-checkbox"
          />
          <div className="todo-content">
            <div className="todo-text">{todo.text}</div>
            {todo.description && (
              <div className="todo-description">{todo.description}</div>
            )}
            <div className="todo-meta">
              {todo.startTime && (
                <div className="todo-time">
                  <FontAwesomeIcon icon="clock" />
                  {formatTime(todo.startTime)}
                  {todo.endTime && ` - ${formatTime(todo.endTime)}`}
                </div>
              )}
              {todo.duration > 0 && (
                <div className="todo-duration">
                  <FontAwesomeIcon icon="hourglass" />
                  {formatDuration(todo.duration)}
                </div>
              )}
              <div className={`todo-priority ${todo.priority}`}>
                {getPriorityIcon(todo.priority)}
                <span>{getPriorityLabel(todo.priority)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="todo-actions">
          <button
            onClick={() => onDelete(todo.id)}
            className="action-button"
            title="Excluir tarefa"
          >
            <FontAwesomeIcon icon="trash" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente TodoList
const TodoList = ({ todos, onToggle, onDelete }) => {
  if (!todos.length) {
    return (
      <div className="empty-message">
        <FontAwesomeIcon icon="circle-check" size="2x" />
        <div>Nenhuma tarefa por hoje! Aproveite seu dia!</div>
      </div>
    );
  }

  return (
    <div className="todos-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

// Componente Filters
const Filters = ({ filter, setFilter }) => {
  const filters = [
    { key: 'all', label: 'Todas', icon: 'list-check' },
    { key: 'active', label: 'Pendentes', icon: 'circle' },
    { key: 'completed', label: 'Concluídas', icon: 'circle-check' },
    { key: 'high', label: 'Prioridade Alta', icon: 'circle-exclamation' }
  ];

  return (
    <div className="filters">
      {filters.map(({ key, label, icon }) => (
        <button
          key={key}
          className={`filter-button ${filter === key ? 'active' : ''}`}
          onClick={() => setFilter(key)}
        >
          <FontAwesomeIcon icon={icon} />
          {label}
        </button>
      ))}
    </div>
  );
};

// Componente Dashboard
const Dashboard = ({ todos }) => {
  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
    totalHours: (todos.reduce((acc, todo) => acc + (todo.duration || 0), 0) / 60).toFixed(1),
    highPriority: todos.filter(t => t.priority === 'high' && !t.completed).length
  };

  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const productivityScore = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="dashboard">
      <h2>
        <FontAwesomeIcon icon="chart-bar" />
        Dashboard do Dia
      </h2>
      
      <div className="stats-grid">
        <div className="stat-card highlight">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">
            <FontAwesomeIcon icon="list-check" />
            Total de Tarefas
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.completed}</span>
          <span className="stat-label">
            <FontAwesomeIcon icon="circle-check" />
            Concluídas
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.pending}</span>
          <span className="stat-label">
            <FontAwesomeIcon icon="circle" />
            Pendentes
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.totalHours}h</span>
          <span className="stat-label">
            <FontAwesomeIcon icon="clock" />
            Horas Planejadas
          </span>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-bars">
          <div>
            <div className="progress-info">
              <span>
                <FontAwesomeIcon icon="chart-line" />
                Progresso do Dia
              </span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="progress-info">
              <span>
                <FontAwesomeIcon icon="tachometer-alt" />
                Produtividade
              </span>
              <span>{productivityScore}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${productivityScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {stats.highPriority > 0 && (
        <div className="stat-card" style={{ borderLeftColor: 'var(--accent-error)' }}>
          <span className="stat-number" style={{ color: 'var(--accent-error)' }}>
            {stats.highPriority}
          </span>
          <span className="stat-label">
            <FontAwesomeIcon icon="circle-exclamation" />
            Tarefas de Alta Prioridade Pendentes
          </span>
        </div>
      )}
    </div>
  );
};

// Componente Footer
const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="copyright">
          © 2024 To do Today - Desenvolvido por 🍵 ChaMatheus
        </div>
        <div className="social-links">
          <a 
            href="https://github.com/ChaMatteCoder" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link"
            title="GitHub"
          >
            <FontAwesomeIcon icon={["fab", "github"]} />
          </a>
          <a 
            href="https://www.instagram.com/cha_matheus" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link"
            title="Instagram"
          >
            <FontAwesomeIcon icon={["fab", "instagram"]} />
          </a>
        </div>
      </div>
    </footer>
  );
};

// Componente principal App
const App = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [currentView, setCurrentView] = useState('list');

  useEffect(() => {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const addTodo = (newTodo) => {
    setTodos(prev => [newTodo, ...prev]);
  };

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      case 'high':
        return todo.priority === 'high' && !todo.completed;
      default:
        return true;
    }
  });

  return (
    <div className="app">
      <div className="todo-container">
        <header className="app-header">
          <div className="theme-toggle-container">
            <button className="theme-toggle" onClick={toggleTheme} title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}>
              <FontAwesomeIcon icon={isDarkMode ? "sun" : "moon"} />
            </button>
          </div>
          
          <div className="header-content">
            <h1 className="animated-title">To do Today</h1>
            <div className="current-date">{currentDate}</div>
          </div>
        </header>

        <div className="view-navigation">
          <button 
            className={`nav-button ${currentView === 'list' ? 'active' : ''}`}
            onClick={() => setCurrentView('list')}
          >
            <FontAwesomeIcon icon="list-check" />
            Lista de Tarefas
          </button>
          <button 
            className={`nav-button ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            <FontAwesomeIcon icon="chart-bar" />
            Dashboard
          </button>
        </div>

        <main className="main-content">
          {currentView === 'list' ? (
            <>
              <AddTodo onAddTodo={addTodo} />
              <Filters filter={filter} setFilter={setFilter} />
              <TodoList 
                todos={filteredTodos}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            </>
          ) : (
            <Dashboard todos={todos} />
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default function AppWrapper() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}