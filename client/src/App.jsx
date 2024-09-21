import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTile] = useState('')
  const [status, setStatus] = useState('pending')
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState('pending')
  const [file, setFile] = useState(null)
  const [editing, setEditing] = useState(null)
  const navigate = useNavigate();

  const checkIncorrectRes = (data) => {
    if (!data.ok) {
      navigate("/login");
    }
  }

  useEffect(() => {
    fetch("http://localhost:3000", {
      method: 'GET',
      credentials: 'include'
    })
      .then((data) => {
        checkIncorrectRes(data);
        return data.json()
      })
      .then((data) => setTasks(data))
  }, []);
  const handleAddTask = (e) => {
    e.preventDefault();
    const task = new FormData()
    task.append('title', title)
    task.append('dueDate', dueDate)
    task.append('status', status)
    task.append('file', file)

    fetch("http://localhost:3000/add", {
      method: "POST",
      body: task,
      credentials: 'include'
    })
      .then((data) => {
        checkIncorrectRes(data);
        return data.json()
      })
      .then((data) => {
        setTasks((prevTasks) => [...prevTasks, data]);
        setFile(null);
        setDueDate('');
        setStatus('pending');
        setTile('');
      })
  }

  const handleDelete = (e, taskId) => {
    fetch(`http://localhost:3000/delete/${taskId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then((data) => {
        checkIncorrectRes(data);
        return data.json()
      })
      .then((data) => setTasks((prevTasks) => prevTasks.filter((task) => task.id !== +data.id)))
  }

  const handleFilter = (e) => {
    e.preventDefault()

    fetch(`http://localhost:3000/filter/${filter}`, {
      credentials: 'include'
    })
      .then((data) => {
        checkIncorrectRes(data);
        return data.json()
      })
      .then((data) => setTasks(data))
  }

  const handleRemoveFilters = (e) => {
    fetch('http://localhost:3000', {
      credentials: 'include'
    })
      .then((data) => {
        checkIncorrectRes(data);
        return data.json()
      })
      .then((data) => setTasks(data))
  }

  const handleEdit = (task) => {
    setEditing(task.id)
    setDueDate(task.dueDate)
    setStatus(task.status)
    setTile(task.title)
  }

  const handleUpdate = (e) => {
    e.preventDefault();

    const task = { title, dueDate, status }
    fetch(`http://localhost:3000/update/${editing}`, {
      method: "PUT",
      body: JSON.stringify(task),
      headers: { "Content-Type": "application/json" },
      credentials: 'include'
    })
      .then((data) => {
        checkIncorrectRes(data);
        return data.json()
      })
      .then((data) => {
        setTasks((prevTasks) => prevTasks.map((task) => {
          if (task.id === +data.id) {
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
