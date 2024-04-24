import { useState } from "react";
import "../App.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  async function login() {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include' 
    });
    const json = await res.json();
    if (res.status === 401) {
      setError("Login fallito: Username o Password errati");
    } else if (res.ok) {
      setError("");
      onLogin(true); 
    } else {
      setError("Errore non specificato");
    }
  }

  return (
    <div className="login">
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
      {/* {error && <div className="error">{error}</div>}   */}
    </div>
  );
}