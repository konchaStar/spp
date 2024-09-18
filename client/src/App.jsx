import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTile] = useState('')
  const [status, setStatus] = useState('pending')
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState('pending')
  const [file, setFile] = useState(null)

  useEffect(() => {
    fetch("http://localhost:3000")
      .then((data) => data.json())
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
    })
      .then((data) => data.json())
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
    })
      .then((data) => data.json())
      .then((data) => setTasks(data))
  }

  const handleFilter = (e) => {
    e.preventDefault()

    fetch(`http://localhost:3000/filter/${filter}`)
      .then((data) => data.json())
      .then((data) => setTasks(data))
  }

  const handleRemoveFilters = (e) => {
    fetch('http://localhost:3000')
      .then((data) => data.json())
      .then((data) => setTasks(data))
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
        <button type="submit">Add Task</button>
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
        <button onClick={(e) => handleDelete(e, task.id)}>Delete</button>
      </div>)}
    </div>
  )
}

export default App
