import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTile] = useState('')
  const [status, setStatus] = useState('pending')
  const [dueDate, setDueDate] = useState('')
  const [file, setFile] = useState(null)

  useEffect(() => {
    fetch("http://localhost:3000")
      .then((data) => data.json())
      .then((data) => setTasks(data))
  }, []);
  const handleAddTask = (e) => {
    e.preventDefault();
    // const task = {
    //   title: title,
    //   dueDate: dueDate,
    //   status: status
    // }
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
      .then((data) => setTasks((prevTasks) => [...prevTasks, data]))
  }

  return (
    <div>
      <h1>Tasks</h1>
      <form onSubmit={handleAddTask}>
        <input type="text" name="title" required value={title} onChange={(e) => setTile(e.target.value)}/>
        <select name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <input type="date" name="dueDate" required value={dueDate} onChange={(e) => {setDueDate(e.target.value)}}/>
        <input type="file" name="file" onChange={(e) => setFile(e.target.files[0])}/>
        <button type="submit">Add Task</button>
      </form>
      {tasks.forEach((task) => {console.log(task)})}
      {tasks.map((task) => <div key={task.id}>{task.title}-{task.status}-{task.dueDate}<a href={`http://localhost:3000/uploads/${task.file}`}  target="_blank">View file</a></div>)}
    </div>
  )
}

export default App
