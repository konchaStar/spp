import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import { io } from 'socket.io-client'

const socket = io("ws://localhost:8080");

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTile] = useState('')
  const [status, setStatus] = useState('pending')
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState('pending')
  const [file, setFile] = useState(null)
  const [editing, setEditing] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("getTasks");
    socket.on("tasks", (data) => setTasks(data))
    socket.on("tokenError", () => {
      navigate("/login")
    })
  }, []);
  const handleAddTask = (e) => {
    e.preventDefault();
    const task = { title, dueDate, status, file };
    socket.emit("addTask", task);
    socket.on("newTask", (data) => {
      setTasks((prevTasks) => [...prevTasks, data]);
      setFile(null);
      setDueDate('');
      setStatus('pending');
      setTile('');
    });
  }

  const handleDelete = (e, taskId) => {
    socket.emit("deleteTask", taskId);
    socket.on("deletedTask", (id) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== +id))
    });
  }

  const handleFilter = (e) => {
    e.preventDefault()

    socket.emit("getFilteredTasks", filter);
    socket.on("filteredTasks", (data) => setTasks(data));
  }

  const handleRemoveFilters = (e) => {
    socket.emit("getTasks")
  }

  const handleEdit = (task) => {
    setEditing(task.id)
    setDueDate(task.dueDate)
    setStatus(task.status)
    setTile(task.title)
  }

  const handleUpdate = (e) => {
    e.preventDefault();

    const task = { title, dueDate, status, id: editing }
    socket.emit("updateTask", task);
    socket.on("updatedTask", (id) => {
      setTasks((prevTasks) => prevTasks.map((task) => {
        if (task.id === +id) {
          task.title = title
          task.dueDate = dueDate
          task.status = status
        }
        return task;
      }))
      setEditing(null)
      setTile('')
      setDueDate('')
      setStatus('pending')
    })
  }

  return (
    <div>
      <h1>Tasks</h1>
      <form onSubmit={handleAddTask}>
        <input type="text" name="title" required value={title} onChange={(e) => setTile(e.target.value)} />
        <select name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <input type="date" name="dueDate" required value={dueDate} onChange={(e) => { setDueDate(e.target.value) }} />
        <input type="file" name="file" onChange={(e) => setFile(e.target.files[0])} />
        {editing === null ? <button type="submit">Add Task</button> : <button onClick={handleUpdate}>Edit Task</button>}
      </form>
      <form onSubmit={handleFilter}>
        <select name="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <button type='submit'>Filter</button>
      </form>
      <button onClick={handleRemoveFilters}>Remove filters</button>
      {tasks.map((task) => <div key={task.id}>{task.title}-{task.status}-{task.dueDate}{task.file && (<a href={`http://localhost:3000/uploads/${task.file}`} target="_blank">View file</a>)}
        <button onClick={() => handleEdit(task)}>Edit</button>
        <button onClick={(e) => handleDelete(e, task.id)}>Delete</button>
      </div>)}
    </div>
  )
}

export default App
