import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  useEffect(() => {
    fetch("http://localhost:3000")
    .then((data) => data.json())
    .then((data) => setTasks(data))
  }, []);
  return (
    <div>
      {tasks.map((task) => <div key={task.id}>{task.title}</div>)}
    </div>
  )
}

export default App
