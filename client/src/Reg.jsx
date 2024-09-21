import { useState } from "react"
import { useNavigate, Link } from 'react-router-dom'
import { socket } from "./App"
import { getCookie } from "./App"

function Reg() {
    const [message, setMessage] = useState('')
    const [userName, setUser] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate();

    const handleReg = (e) => {
        e.preventDefault()

        fetch('http://localhost:3000/reg', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({userName, password}),
            headers: { "Content-Type": "application/json" }
        })
            .then((data) => {
                if (data.ok) {
                    socket.auth = {token: getCookie("token")}
                    socket.disconnect();
                    socket.connect();
                    navigate("/");
                } else {
                    return data.json();
                }
            })
            .then((data) => setMessage(data.message));
    }

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleReg}>
                <label>User</label><br/>
                <input type="text" name="userName" required value={userName} onChange={(e) => setUser(e.target.value)} /><br/>
                <label>Password</label><br/>
                <input type="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} /><br/>
                {message && <span style={{ color: 'red' }}>{message}</span>}<br />
                <button>Register</button>
            </form>
            <Link to="/login">Login</Link>
        </div>
    )
}

export default Reg