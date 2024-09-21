import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'


function Login() {
    const [message, setMessage] = useState('')
    const [userName, setUser] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault()

        fetch('http://localhost:3000/login', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({userName, password}),
            headers: { "Content-Type": "application/json" }
        })
            .then((data) => {
                if (data.ok) {
                    navigate("/");
                } else {
                    return data.json();
                }
            })
            .then((data) => setMessage(data.message));
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <label>User</label><br/>
                <input type="text" name="userName" required value={userName} onChange={(e) => setUser(e.target.value)} /><br/>
                <label>Password</label><br/>
                <input type="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} /><br/>
                {message && <span style={{ color: 'red' }}>{message}</span>}<br />
                <button>Login</button>
            </form>
            <Link to="/register">Register</Link>
        </div>
    )
}

export default Login